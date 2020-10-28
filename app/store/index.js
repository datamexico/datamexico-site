/**
 * This object will be used to pre-populate the redux store with any
 * static values you may need.
 */
export const initialState = {};

/**
 * This array can contain redux middlewares that will be used in the
 * redux store. The loggerMiddleware is provided as an example.
 */
export const middleware = [];

import {cmsReducer} from "@datawheel/canon-cms";
export const reducers = {
  cms: cmsReducer
};
