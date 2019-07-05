#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

#
# Install
#
export SWIFT_VERSION="5.0.1"
wget "https://swift.org/builds/swift-$SWIFT_VERSION-release/ubuntu1604/swift-$SWIFT_VERSION-RELEASE/swift-$SWIFT_VERSION-RELEASE-ubuntu16.04.tar.gz"
tar xzf swift-*-ubuntu16.04.tar.gz
SWIFT_PATH=$(realpath swift-*/usr/bin)
export PATH="$SWIFT_PATH:$PATH"
swift --version

(
  cd version3/swift

  #
  # Compile library
  #

  # Simulate user input
  python3 config64.py <<END_OF_INPUT
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
  swiftc -I. -L. -lamcl -led25519 -lnist256 -lgoldilocks -lbn254 -lbls383 -lbls24 -lbls48 -lrsa2048 TestALL.swift
  swiftc -I. -L. -lamcl -lbn254 -lbls383 -lbls24 -lbls48 TestBLS.swift
  swiftc -I. -L. -lamcl TestNHS.swift
  swiftc -I. -L. -lamcl -led25519 -lnist256 -lgoldilocks -lbn254 -lbls383 -lbls24 -lbls48 -lrsa2048 BenchtestALL.swift
  ls -lA # debug compilation, just to get some visibility

  #
  # Run examples
  #
  export LD_LIBRARY_PATH=.
  ./TestALL
  ./TestBLS
  ./TestNHS
  ./BenchtestALL
)
