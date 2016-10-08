#!/bin/bash

cd platform/browser
git init

git config user.name "Travis CI"
git config user.email "<unelmansa@alasekvenssi.com>"

git add .
git commit -m "Deploy to GitHub Pages"

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master > /dev/null 2>&1
