#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

#
# Install
#

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# shellcheck disable=SC1090
source "$HOME/.cargo/env"
rustup target add wasm32-unknown-emscripten

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
mkdir build-wasm-rust
cp -R version3/rust/* version3/wasm/config.py build-wasm-rust

(
  cd build-wasm-rust

  #
  # Compile library
  #
  cargo rustc --release --features "bn254 bls383 bls24 bls48 ed25519 nist256 goldilocks rsa2048" --target wasm32-unknown-emscripten
  cp target/wasm32-unknown-emscripten/release/libamcl.rlib .

  #
  # Compile examples
  #
  rustc -O --target=wasm32-unknown-emscripten TestALL.rs --extern amcl=libamcl.rlib -o TestALL.html
  rustc -O --target=wasm32-unknown-emscripten TestBLS.rs --extern amcl=libamcl.rlib -o TestBLS.html
  rustc -O --target=wasm32-unknown-emscripten TestNHS.rs --extern amcl=libamcl.rlib -o TestNHS.html
  rustc -O --target=wasm32-unknown-emscripten BenchtestALL.rs --extern amcl=libamcl.rlib -o BenchtestALL.html

  #
  # Run examples
  #
  node TestALL.js <<END_OF_INPUT
1234
1234
1234
1234
END_OF_INPUT
  node TestBLS.js
  node TestNHS.js
  node BenchtestALL.js
)
