import sys
import numpy as np
import json
import pandas as pd
import requests

from complexity.complexity import complexity

def main():
    if len(sys.argv) > 1 and bool(json.loads(sys.argv[1])):
        params = json.loads(sys.argv[1])
    else:
        params = {'cube': 'economy_foreign_trade_ent', 'rca': 'State,HS4 4 Digit,Trade Value', 'Date Year': '2018', 'filter_State': '14'}
    API = str(sys.argv[2]) if len(sys.argv) > 2 else "https://api.datamexico.org/tesseract/data"
    dd1, dd2, measure = params["rca"].split(",")

    dd1_id = "{} ID".format(dd1)
    dd2_id = "{} ID".format(dd2)

    r = requests.get(API, params=params)
    df = pd.DataFrame(r.json()["data"])

    df_labels = df[["{}".format(dd1), dd1_id]].drop_duplicates()

    if "thresholdPopulation" in params:
        popParams = {
            "Year": "2015",
            "cube": "inegi_population",
            "drilldowns": dd1,
            "measures": "Population"
        }
        r_pop = requests.get(API, params=popParams)
        df_pop = pd.DataFrame(r_pop.json()["data"])
        th_pop = df_pop[df_pop["Population"] > int(params["thresholdPopulation"])][dd1_id].unique()

        df["pivot"] = [i in th_pop for i in df[dd1_id]]
        df = df[df["pivot"] == True].copy()
        df = df.drop(columns=["pivot"])


    if "threshold" in params:
        df["pivot"] = df[df[measure] > int(params["threshold"])]
        df = df[df["pivot"] == True].copy()
        df = df.drop(columns=["pivot"])


    df = df.pivot(
        index=dd1_id, columns=dd2_id, values="{} RCA".format(measure)
    ).reset_index().set_index(dd1_id).dropna(axis=1, how="all").fillna(0)
    df = df.astype(float)

    iterations = int(params["iterations"]) if "iterations" in params else 20
    eci, pci = complexity(df, iterations)

    # print(eci.head())
    # sys.exit()

    results = pd.DataFrame(eci).rename(columns={0: "{} ECI".format(measure)}).reset_index()
    results = df_labels.merge(results, on=dd1_id)

    print(json.dumps({
      "data": json.loads(results.to_json(orient="records"))
    }))


if __name__ == "__main__":
    main()
