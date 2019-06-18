#!/usr/bin/env bash

DEBUG=* node ./apiGateway/app.js >> ./logs/apiGateway.txt &
DEBUG=* node ./UserService/app.js >> ./logs/UserService.txt &
DEBUG=* node ./StatutsServices/app.js >> ./logs/StatutsService.txt &
DEBUG=* node ./AuthService/app.js >> ./logs/AuthService.txt
