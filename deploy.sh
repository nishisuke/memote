#!/bin/bash

set -eux

npm run compile
cp manifest.json prd/
firebase deploy
