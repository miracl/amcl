#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

(
  cd version3/cpp

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
  g++ -O3 testall.cpp amcl.a -o testall
  g++ -O3 testbls.cpp amcl.a -o testbls
  g++ -O3 testnhs.cpp amcl.a -o testnhs
  g++ -O3 benchtest_all.cpp amcl.a -o benchtest_all

  #
  # Run examples
  #
  echo 1234 | ./testall
  ./testbls
  ./testnhs
  ./benchtest_all
)
