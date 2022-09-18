#!/bin/bash

[ -d "./deployment" ] && rm -r ./deployment
cp -R ./backend ./deployment
npm --prefix ./frontend run build
cp -R ./frontend/build ./deployment/build
npm --prefix ./deployment run pack