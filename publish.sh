#!/bin/bash

rm -rf static/*
rm -rf UniqueUpToPermutation.github.io/*

gssg --url http://uniqueuptopermutation.github.io

cp -r static/* UniqueUpToPermutation.github.io/

cd UniqueUpToPermutation.github.io
git add **
git commit -a -m "automated update"
git push


