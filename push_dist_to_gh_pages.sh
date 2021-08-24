#!/bin/bash

set -o errexit
set -x

if [[ $(git status --porcelain) ]]; then
    echo "there is something uncommited"
    exit 1
fi


npm run build
mv -f dist/* .
git branch -D gh-pages || true
git checkout -b gh-pages
git add -A
git commit -m 'update build'
git push --force --set-upstream origin gh-pages
git checkout -
