import sys
import numpy as np
import pandas as pd
import warnings

def complexity(rcas, iterations=20, drop=True):

    rcas = rcas.copy()
    rcas[rcas >= 1] = 1
    rcas[rcas < 1] = 0

    # prods_to_drop = [10202, 10308, 20705, 20905, 21102, 21202, 31520, 31521, 41703, 41801, 41804, 42006, 42402, 52501, 52503, 52512, 52517, 52528, 52529, 52602, 52616, 52701, 52713, 62805, 62816, 62822, 63101, 63201, 63202, 63606, 63702, 74003, 94405, 94413, 104703, 104706, 115111, 115203, 115205, 115207, 115306, 115403, 115605, 115803, 115908, 136801, 136901, 136905, 136910, 147106, 147109, 157224, 157303, 157313, 157322, 157402, 157603, 157611, 157614, 157905, 158107, 158111, 168410, 178713, 189002, 189104, 199305, 209508]
    # rcas = rcas.drop(prods_to_drop, axis = 1)

    rcas_clone = rcas.copy()

    # drop columns / rows only if completely nan
    rcas_clone = rcas_clone.dropna(how="all")
    rcas_clone = rcas_clone.dropna(how="all", axis=1)

    if rcas_clone.shape != rcas.shape:
        warnings.warn("[Warning] RCAs contain columns or rows that are entirely comprised of NaN values.")
        if drop:
            rcas = rcas_clone

    kp = rcas.sum(axis=0)
    kp_zeros = kp[kp == 0.0]
    if(len(kp_zeros)):
        warnings.warn("[Warning] RCAs contain 0s in columns.")
        rcas = rcas.drop(kp_zeros.index, axis = 1)
        kp = rcas.sum(axis=0)

    kc = rcas.sum(axis=1)
    kc_zeros = kc[kc == 0.0]
    if(len(kc_zeros)):
        warnings.warn("[Warning] RCAs contain 0s in rows.")
        rcas = rcas.drop(kc_zeros.index, axis=0)
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
