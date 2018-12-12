# README

NOTE: This version of the library requires Version 1.17+ of Rust for 64-bit
support. Unfortunately support for the 128-bit integer type is still
flagged as unstable, and so for now a nightly build of rust must be used.

NEW: 128-bit integers are now stable with version 1.26. So please use latest
version.

Now AMCL version 3 is distributed as a cargo crate.
To use the curve (or algorithm) that you need you have to put it as a dependency and to state a corresponding feature in your `Cargo.toml`.

Example:

To use BLS48:

```rust
amcl = { version = "0.2.0",  optional = true, default-features = false, features = ["bls48"]}
```

Then, in your `main.rs` or `lib.rs` (you don't need it if you use Rust 2018) :
```rust
extern crate amcl;
```

And to use primitives of needed curve:
```rust
use amcl::bls48::{ECP, ECP8}; //any primitive you need
```
