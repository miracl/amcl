#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

TOOLCHAIN="stable"

#
# Install
#
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain "$TOOLCHAIN" -y
# shellcheck disable=SC1090
source "$HOME/.cargo/env"

(
  cd version3/rust

  #
  # Build
  #
  cargo build --all-features --release

  rustc TestALL.rs --extern amcl=target/release/libamcl.rlib
  rustc TestBLS.rs --extern amcl=target/release/libamcl.rlib
  rustc TestNHS.rs --extern amcl=target/release/libamcl.rlib
  rustc BenchtestALL.rs --extern amcl=target/release/libamcl.rlib

  #
  # Run examples
  #
  ./TestALL <<END_OF_INPUT
1234
1234
1234
1234
END_OF_INPUT
  ./TestBLS
  ./TestNHS
  ./BenchtestALL

  #
  # Deploy
  #
  if [[ "$TRAVIS_BRANCH" == "master" ]] && [[ "$TRAVIS_TAG" == "" ]] && [[ "$TRAVIS_PULL_REQUEST_BRANCH" == "" ]]; then
      echo "TODO: make crates.io deployment work again"
  fi
)
