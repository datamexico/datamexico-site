from complexity.density import density
from complexity.proximity import proximity

import sys
import numpy as np
import json
import pandas as pd
import requests


def main():
    params = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {'cube': 'economy_foreign_trade_ent', 'rca': 'State,HS4 4 Digit,Trade Value', 'Date Year': '2018', 'filter_State': '14'}
    API = str(sys.argv[2]) if len(sys.argv) > 2 else "https://api.datamexico.org/tesseract/data"
    dd1, dd2, measure = params["rca"].split(",")

    dd1_id = "{} ID".format(dd1)
    dd2_id = "{} ID".format(dd2)

    r = requests.get(API, params=params)
    df = pd.DataFrame(r.json()["data"])

    dd1_df = df[["{}".format(dd1), dd1_id]].drop_duplicates()
    dd2_df = df[["{}".format(dd2), dd2_id]].drop_duplicates()

    df_rca = df.copy()
    df_rca["pivot"] = df_rca[dd1_id].astype(str) + "_" + df_rca[dd2_id].astype(str)
    df_rca = df_rca[["pivot", "{} RCA".format(measure)]]

    df = df.pivot(
        index=dd1_id, columns=dd2_id, values="{} RCA".format(measure)
    ).reset_index().set_index(dd1_id).dropna(axis=1, how="all").fillna(0)
    df = df.astype(float)

    '''
        Calculate densities using ps_calcs density script
        note: need to fillna w/ 0 in case there are NaNs returned
    '''
    densities = density(df, proximity(df).fillna(0))

    densities = pd.melt(densities.reset_index(), id_vars=[dd1_id], value_name="{} Relatedness".format(measure))
    '''
        Some drilldowns (dd) may be ints (such as in the case of HS products)
        for this reason we need to use the .infer_objects() function to cast
        them base to their proper dtype. Otherwise pandas will throw a mismatched
        types error, like so--
        ValueError: You are trying to merge on object and int64 columns.
    '''
    densities = densities.infer_objects()
    densities["pivot"] = densities[dd1_id].astype(str) + "_" + densities[dd2_id].astype(str)

    densities = densities.merge(dd1_df, on=dd1_id)
    densities = densities.merge(dd2_df, on=dd2_id)
    densities = densities.merge(df_rca, on="pivot")
    densities = densities.drop(columns=["pivot"])

    for dd in [dd1, dd2]:
        filter_var = "filter_{}".format(dd)
        if filter_var in params:
            filter_param = params[filter_var]
            densities["{} ID".format(dd)] = densities["{} ID".format(dd)].astype(str)
            densities = densities[densities["{} ID".format(dd)] == filter_param]

    print(json.dumps({
      "data": json.loads(densities.to_json(orient="records"))
      }))

if __name__ == "__main__":
    main()
