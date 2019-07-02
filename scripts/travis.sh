#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

case "$AMCL_LANG" in
  js)
    ./scripts/travis_js.sh
    ;;
  rust)
    ./scripts/travis_rust.sh
    ;;
  *)
    echo "Unknown value for AMCL_LANG"
    exit 1
esac
