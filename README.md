![Metrisk](.github/imgs/logo.svg)

# Bump Release PR Action

This Github action will either update or create a release PR.

## Usage

Example below shows the action being used to update a release PR whenever a Pull Request is merged.

```yaml
on:
  pull_request:
    types: [ closed ]
  workflow_dispatch:
name: Create Release PR
if: ${{ github.event.pull_request.merged == true }}
jobs:
  bumpPR:
    runs-on: ubuntu-latest
    name: Bump PR
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Git Config
        run: |
          git config --local user.email "$(git log --format='%ae' HEAD^!)"
          git config --local user.name "$(git log --format='%an' HEAD^!)"
      - name: Release PR
        uses: metrisk/bump-release-pr@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Features

* Uses the [conventional-changelog-metrisk](https://github.com/metrisk/conventional-changelog-metrisk) preset in order to include all of the changes made to main in the PR body, including dependency updates.

* Creates a new `release` branch if one does not already exist and also creates the PR for that branch.


## Issues

Currently has an issue that is caused by a [shelljs issue](https://github.com/shelljs/shelljs/issues/1024)
