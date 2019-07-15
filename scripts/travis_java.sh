#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

(
  cd version3/java

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

  cd amcl
  mvn clean install
)
