#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

case "$AMCL_LANG" in
  cpp)
    ./scripts/travis_cpp.sh
    ;;
  java)
    ./scripts/travis_java.sh
    ;;
  js)
    ./scripts/travis_js.sh
    ;;
  rust)
    ./scripts/travis_rust.sh
    ;;
  swift)
    ./scripts/travis_swift.sh
    ;;
  wasm-c)
    ./scripts/travis_wasm-c.sh
    ;;
  wasm-rust)
    ./scripts/travis_wasm-rust.sh
    ;;
  *)
    echo "Unknown value for AMCL_LANG"
    exit 1
esac
