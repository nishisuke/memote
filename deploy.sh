#!/bin/bash

set -eux

npm run compile
cp static/manifest.json prd/
firebase deploy
