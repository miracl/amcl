# AMCL for WebAssembly

The AMCL library already has a JavaScript version, but can also run up
to 10 times faster in a browser that supports WebAssembly. And thats
most of the popular browsers in use today.

The C, C++ or Rust version of the AMCL library can be compiled to a
bitcode that runs directly in the browser, by-passing JavaScript
entirely. Which is good for our type of application, as the way
in which JavaScript handles integer arithmetic is very slow.

To install the Emscripten C/C++ compiler follow the instructions
from https://webassembly.org/getting-started/developers-guide/.

## WebAssembly from the C codebase

Copy the AMCL C code into a new directory, along with
the config.py file from this directory.

In the new directory execute

```
python3 config.py
```

Then select options 1, 3, 7, 18, 20, 25, 26 and 27, which are fixed for
the example programs.

Build the test programs with

```
emcc -O2 testall.c amcl.a -s WASM=1 -o testall.html
emcc -O2 testbls.c amcl.a -s WASM=1 -o testbls.html
emcc -O2 testnhs.c amcl.a -s WASM=1 -o testnhs.html
emcc -O2 benchtest_all.c amcl.a -s WASM=1 -o benchtest_all.html
```

### Run examples in Browser

Then run a local HTML server (as described in the link above) and load the
HTML file. Wait for programs to complete (which will take a while).

### Run examples in Node.js

```
echo 1234 | node testall.js
node testbls.js
node testnhs.js
node benchtest_all.js
```

## WebAssembly from the Rust codebase

Webassembly can also be generated from the Rust code. First the Rust compiler
must be updated to target wasm, by

```
rustup target add wasm32-unknown-emscripten
```

Copy the AMCL Rust code into a new directory, along with
the config.py file from this directory.

The Emscripten toolchain is also required, as above.

Build the Rust library by executing

```
cargo rustc --release --features "bn254 bls383 bls24 bls48 ed25519 nist256 goldilocks rsa2048" --target wasm32-unknown-emscripten
```

Copy the AMCL library to the current directory

```
cp target/wasm32-unknown-emscripten/release/libamcl.rlib .
```

Finally build one of the test programs using

```
rustc -O --target=wasm32-unknown-emscripten TestALL.rs --extern amcl=libamcl.rlib -o TestALL.html
rustc -O --target=wasm32-unknown-emscripten TestBLS.rs --extern amcl=libamcl.rlib -o TestBLS.html
rustc -O --target=wasm32-unknown-emscripten TestNHS.rs --extern amcl=libamcl.rlib -o TestNHS.html
rustc -O --target=wasm32-unknown-emscripten BenchtestALL.rs --extern amcl=libamcl.rlib -o BenchtestALL.html
```

The resulting .html and .js examples can be run as described in the C section.
