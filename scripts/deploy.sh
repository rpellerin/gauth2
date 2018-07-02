#!/bin/bash

TARGET_BRANCH="gh-pages"
DATE=$(date --iso-8601=seconds)

cd build
git init
git remote add origin https://${GH_TOKEN}@github.com/rpellerin/gauth2.git
git fetch origin

BRANCH_EXISTS=`git rev-parse --verify origin/$TARGET_BRANCH`

if [ -n "$BRANCH_EXISTS" ]; then
    echo "Branch $TARGET_BRANCH exists"
    git add -A
    git commit --no-verify -m 'Latest build'
    rm ../diff -f
    git diff-index origin/$TARGET_BRANCH --binary -p > ../diff
    if [ ! -s ../diff ]; then
        echo "$TARGET_BRANCH has not changed. Won't push.";
        exit 0
    fi
    git checkout -b $TARGET_BRANCH origin/$TARGET_BRANCH
    git apply ../diff
else
    echo "Branch $TARGET_BRANCH does not exist"
    git checkout -b $TARGET_BRANCH
fi

git add -A
git commit --no-verify -m "Release-$DATE"
git push -q origin $TARGET_BRANCH:$TARGET_BRANCH >/dev/null 2>&1
