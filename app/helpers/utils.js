import {format} from "d3-format";

export const commas = n => format(",")(Math.round(n));

export const percentagenumber = n => `${Math.round((n * 100) * 10) / 10}%`;

export const backgroundID = Math.floor(Math.random() * (3 - 1 + 1) + 1);
