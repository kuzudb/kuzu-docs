#!/usr/bin/env bash

if [[ -n "$KUZU_NEW_VERSION" ]];then
    echo "Using user specified version..."
    version="$KUZU_NEW_VERSION"
else
    echo "Getting latest release version..."
    version="$(curl -s https://api.github.com/repos/kuzudb/kuzu/releases/latest | grep -o '"tag_name": *"[^"]*"' | cut -d'"' -f4 | sed 's/^v//')"
fi

if ! echo "$version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' ;then
    echo "Error: version is not a valid SEMVER: $version"
    exit 1
fi

echo "Updating to version: $version"
KUZU_VERSION=$version
UPDATE_BRANCH=version-$version

if git ls-remote --exit-code --quiet --heads origin refs/heads/"$UPDATE_BRANCH" > /dev/null;then
    echo "Error: branch already exists: origin -> $UPDATE_BRANCH"
    exit 1
fi

echo "Creating new branch..."
git checkout -b "$UPDATE_BRANCH"

echo "Updating version in files..."
sed --in-place --regexp-extended \
    -e "s;(kuzu/releases/download/v)[0-9\.]+;\1$KUZU_VERSION;" \
    -e "s;(<version>)[0-9\.]+(</version>);\1$KUZU_VERSION\2;" \
    -e "s;(com.kuzudb:kuzu:)[0-9\.]+;\1$KUZU_VERSION;" \
    $(find ./src/ -type f -name '*.mdx' -o -name '*.md')

if git diff-index --quiet HEAD -- ;then
    echo "Error: no files were updated to version $KUZU_VERSION"
    exit 1
fi

echo "Committing files..."
git status
git add .
git commit -m "release: version $KUZU_VERSION"

echo "Pushing branch..."
git push origin "$UPDATE_BRANCH"

echo "Creating PR..."
gh pr create \
    --base main \
    --head "$UPDATE_BRANCH" \
    --title "release: version $KUZU_VERSION" \
    --body ""
