#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

NODEJS_VERSION="8"

(
  cd version3/js

  #
  # Install
  #

  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
  nvm use "$NODEJS_VERSION"
  yarn install

  #
  # Test
  #

  # We have 2 cores available (https://docs.travis-ci.com/user/reference/overview/#virtualisation-environment-vs-operating-system),
  # so override jest default (cores - 1).
  yarn test --ci --maxWorkers 2
)
