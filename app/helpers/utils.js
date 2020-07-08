import {format} from "d3-format";

export const commas = n => format(",")(Math.round(n));

export const backgroundID = Math.floor(Math.random() * (6 - 1 + 1) + 1);
