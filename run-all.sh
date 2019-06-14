#!/usr/bin/env bash

node ./apiGateway/app.js >> ./logs/apiGateway.txt &
node ./UserService/app.js >> ./logs/UserService.txt &
node ./StatutsServices/app.js >> ./logs/StatutsService.txt &
node ./AuthService/app.js >> ./logs/AuthService.txt
