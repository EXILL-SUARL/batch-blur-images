#!/usr/bin/env bash

sudo apt update && sudo apt -y upgrade

npm i  @devcontainers/cli ts-node -G
brew install neovim