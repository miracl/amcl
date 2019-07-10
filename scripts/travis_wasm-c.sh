#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

#
# Install
#

# See https://webassembly.org/getting-started/developers-guide/
(
  git clone https://github.com/emscripten-core/emsdk.git
  cd emsdk
  ./emsdk install latest
  ./emsdk activate latest
)

# This makes emcc and node available in the current shell
# shellcheck disable=SC1091
source emsdk/emsdk_env.sh
emcc --version
node --version

#
# Copy files
#
mkdir build-wasm-c
cp version3/c/*.c version3/c/*.h version3/wasm/config.py build-wasm-c

(
  cd build-wasm-c

  #
  # Compile library
  #

  # Simulate user input
  python3 config.py <<END_OF_INPUT
1
3
7
18
20
25
26
27
0
END_OF_INPUT

  #
  # Compile examples
  #
  emcc -O2 testall.c amcl.a -s WASM=1 -o testall.html
  emcc -O2 testbls.c amcl.a -s WASM=1 -o testbls.html
  emcc -O2 testnhs.c amcl.a -s WASM=1 -o testnhs.html
  emcc -O2 benchtest_all.c amcl.a -s WASM=1 -o benchtest_all.html
  ls -lA # debug compilation, just to get some visibility

  #
  # Run examples
  #
  echo 1234 | node testall.js
  node testbls.js
  node testnhs.js
  node benchtest_all.js
)
