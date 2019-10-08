import sys
import numpy as np
import json
import pandas as pd
import requests

from complexity.complexity import complexity

def main():
    params = json.loads(sys.argv[1])
    API = str(sys.argv[2])
    dd1, dd2, measure = params["rca"].split(",")

    dd1_id = "{} ID".format(dd1)
    dd2_id = "{} ID".format(dd2)

    r = requests.get(API, params=params)
    df = pd.DataFrame(r.json()["data"])

    for dd in [dd1, dd2]:
        filter_var = "filter_{}".format(dd)
        if filter_var in params:
            df = df[df["{} ID".format(dd)] == params[filter_var]]

    print(json.dumps({
      "data": json.loads(df.to_json(orient="records"))
      }))


if __name__ == "__main__":
    main()
