#!/bin/bash

for req in "$@"
do
  case ${req:2:1} in
    [rR])
      mode=read;;
    [wW])
      mode=write;;
    [fF])
      mode=finish;;
    *)
      mode=read;;
  esac
    echo "{ 'process': '${req:0:1}', 'pageNumber': ${req:1:1}, 'mode' : '$mode' },"
done
