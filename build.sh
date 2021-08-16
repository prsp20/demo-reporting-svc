#!/bin/sh

rm -rf dist

cd modules/web-controller
yarn dist
cp -R node_modules ../../dist/web-controller
cd ../../

cd dist
cd web-controller && zip -r web-controller.zip ./* && cd ../../



