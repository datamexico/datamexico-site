#!/bin/bash

for f in *.[jJ][pP][gG]
do
    echo $f
    convert $f  -resize 1500x1000^  -gravity center  -extent 1500x1000  $f
done