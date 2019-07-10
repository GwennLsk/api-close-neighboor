#!/usr/bin/env bash

DEBUG=apiGateway:* node ./apiGateway/src/app.js > ./logs/apiGateway.txt 2>&1 &
DEBUG=UserService:* node ./UserService/src/app.js > ./logs/UserService.txt 2>&1 &
DEBUG=* node ./StatutsService/src/app.js > ./logs/StatutsService.txt 2>&1 &
DEBUG=* node ./AuthService/src/app.js > ./logs/AuthService.txt 2>&1 &
