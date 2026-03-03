#!/usr/bin/env bash

set -euo pipefail

git shortlog -sn --since="1 week ago"
