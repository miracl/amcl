pub mod aes;
pub mod gcm;
pub mod hash256;
pub mod hash384;
pub mod hash512;
pub mod rand;
pub mod sha3;
pub mod nhs;

macro_rules! rom_mod {
    ($path: expr) => {
        #[path = $path]
        mod rom;
    };
}

macro_rules! arch {
    () => {
        #[cfg(target_pointer_width = "32")]
        #[path = "arch/arch32.rs"]
        mod arch;
        #[cfg(target_pointer_width = "64")]
        #[path = "arch/arch64.rs"]
        mod arch;
    };
}

macro_rules! curve {
    () => {};
}

macro_rules! rsa {
    ($name: tt, $feature: expr, $path32: expr, $path64: expr) => {
        #[cfg(feature = $feature)]
        #[path = "./"]
        pub mod $name {
            arch!();
            #[cfg(target_pointer_width = "32")]
            rom_mod!($path32);
            #[cfg(target_pointer_width = "64")]
            rom_mod!($path64);
            pub mod big;
            pub mod dbig;
            pub mod ff;
            pub mod rsa;
        }
    };
}

rsa!(rsa2048, "rsa2048", "roms/rom_rsa2048_32.rs", "roms/rom_rsa2048_64.rs");
rsa!(rsa3072, "rsa3072", "roms/rom_rsa3072_32.rs", "roms/rom_rsa3072_64.rs");
rsa!(rsa2048, "rsa3072", "roms/rom_rsa4096_32.rs", "roms/rom_rsa4096_64.rs");