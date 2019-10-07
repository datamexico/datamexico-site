from complexity.density import density
from complexity.proximity import proximity

import sys
import numpy as np
import json
import pandas as pd
import requests


def main():
    params = json.loads(sys.argv[1])
    API = str(sys.argv[2])
    dd1, dd2, measure = params["rca"].split(",")

    dd1_id = "{} ID".format(dd1)
    dd2_id = "{} ID".format(dd2)

    r = requests.get(API, params=params)
    df = pd.DataFrame(r.json()["data"])

    dd1_df = df[["{}".format(dd1), dd1_id]].drop_duplicates()
    dd2_df = df[["{}".format(dd2), dd2_id]].drop_duplicates()

    df = df.pivot(
        index=dd1_id, columns=dd2_id, values="{} RCA".format(measure)
    ).reset_index().set_index(dd1_id).dropna(axis=1, how="all").fillna(0)
    df = df.astype(float)

    densities = density(df, proximity(df))
    densities = pd.melt(densities.reset_index(), id_vars=["State ID"], value_name="{} Relatedness".format(measure))

    densities = densities.merge(dd1_df, on=dd1_id)
    densities = densities.merge(dd2_df, on=dd2_id)

    for dd in [dd1, dd2]:
        filter_var = "filter_{}".format(dd)
        if filter_var in params:
            densities = densities[densities["{} ID".format(dd)] == int(params[filter_var])]

    print(json.dumps({
      "data": json.loads(densities.to_json(orient="records"))
      }))

if __name__ == "__main__":
    main()
