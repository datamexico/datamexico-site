import sys
import numpy as np
import json
import pandas as pd
import requests

API = "https://api.datamexico.org/tesseract/data"

def complexity(rcas, iterations=20, drop=True):

    rcas = rcas.copy()
    rcas[rcas >= 1] = 1
    rcas[rcas < 1] = 0

    rcas_clone = rcas.copy()

    # drop columns / rows only if completely nan
    rcas_clone = rcas_clone.dropna(how="all")
    rcas_clone = rcas_clone.dropna(how="all", axis=1)

    if rcas_clone.shape != rcas.shape:
        print("[Warning] RCAs contain columns or rows that are entirely comprised of NaN values.")
    if drop:
        rcas = rcas_clone

    kp = rcas.sum(axis=0)
    kc = rcas.sum(axis=1)
    kp0 = kp.copy()
    kc0 = kc.copy()

    for i in range(1, iterations):
        kc_temp = kc.copy()
        kp_temp = kp.copy()
        kp = rcas.T.dot(kc_temp) / kp0
        if i < (iterations - 1):
            kc = rcas.dot(kp_temp) / kc0

    geo_complexity = (kc - kc.mean()) / kc.std()
    prod_complexity = (kp - kp.mean()) / kp.std()

    return geo_complexity, prod_complexity

def rca(tbl):

    # fill missing values with zeros
    tbl = tbl.fillna(0)

    col_sums = tbl.sum(axis=1)
    col_sums = col_sums.values.reshape((len(col_sums), 1))

    rca_numerator = np.divide(tbl, col_sums)
    row_sums = tbl.sum(axis=0)

    total_sum = tbl.sum().sum()
    rca_denominator = row_sums / total_sum
    rcas = rca_numerator / rca_denominator

    rcas[rcas >= 1] = 1
    rcas[rcas < 1] = 0

    return rcas


def main():
    params = json.loads(sys.argv[1])
    dd1, dd2, measure = params["rca"].split(",")

    r = requests.get(API, params=params)
    df = pd.DataFrame(r.json()["data"])

    df_labels = df[["{}".format(dd1), "{} ID".format(dd1)]].drop_duplicates()


    if "thresholdPopulation" in params:
        popParams = {
            "Year": "2015",
            "cube": "inegi_population",
            "drilldowns": dd1,
            "measures": "Population"
        }
        r_pop = requests.get(API, params=popParams)
        df_pop = pd.DataFrame(r_pop.json()["data"])
        th_pop = df_pop[df_pop["Population"] > int(params["thresholdPopulation"])]["{} ID".format(dd1)].unique()

        df["pivot"] = [i in th_pop for i in df["{} ID".format(dd1)]]
        df = df[df["pivot"] == True].copy()
        df = df.drop(columns=["pivot"])


    if "threshold" in params:
        df["pivot"] = df[df[measure] > int(params["threshold"])]
        df = df[df["pivot"] == True].copy()
        df = df.drop(columns=["pivot"])


    df = df.pivot(
        index="{} ID".format(dd1), columns="{} ID".format(dd2), values="{} RCA".format(measure)
    ).reset_index().set_index("{} ID".format(dd1)).dropna(axis=1, how="all").fillna(0)
    df = df.astype(float)

    iterations = int(params["iterations"]) if "iterations" in params else 20
    eci, pci = complexity(rca(df), iterations)

    results = pd.DataFrame(eci).rename(columns={0: "{} ECI".format(measure)}).reset_index()
    results = df_labels.merge(results, on="{} ID".format(dd1))

    print(json.dumps({
      "data": json.loads(results.to_json(orient="records"))
      }))

    # return json.dumps(r.json()["data"])



if __name__ == "__main__":
    main()
