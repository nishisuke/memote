#!/bin/bash

set -eux

npm run prd
cp manifest.json prd/
firebase deploy
