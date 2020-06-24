import {format} from "d3-format";

export const commas = n => format(",")(Math.round(n));
