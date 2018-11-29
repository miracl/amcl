pub mod aes;
pub mod gcm;
pub mod hash256;
pub mod hash384;
pub mod hash512;
pub mod rand;
pub mod sha3;
pub mod nhs;

#[cfg(feature = "rsa2048")]
#[path = "./"]
pub mod rsa2048 {
    #[cfg(target_pointer_width = "32")]
    #[path = "arch/arch32.rs"]
    mod arch;
    #[cfg(target_pointer_width = "64")]
    #[path = "arch/arch64.rs"]
    mod arch;

    #[cfg(target_pointer_width = "32")]
    #[path = "roms/rom_rsa2048_32.rs"]
    mod rom;
    #[cfg(target_pointer_width = "64")]
    #[path = "roms/rom_rsa2048_64.rs"]
    mod rom;
    pub mod big;
    pub mod dbig;
    pub mod ff;
    pub mod rsa;
}

#[cfg(feature = "rsa3072")]
#[path = "./"]
pub mod rsa3072 {
    #[cfg(target_pointer_width = "32")]
    #[path = "arch/arch32.rs"]
    mod arch;
    #[cfg(target_pointer_width = "64")]
    #[path = "arch/arch64.rs"]
    mod arch;

    #[cfg(target_pointer_width = "32")]
    #[path = "roms/rom_rsa3072_32.rs"]
    mod rom;
    #[cfg(target_pointer_width = "64")]
    #[path = "roms/rom_rsa3072_64.rs"]
    mod rom;
    pub mod big;
    pub mod dbig;
    pub mod ff;
    pub mod rsa;
}

#[cfg(feature = "rsa4096")]
#[path = "./"]
pub mod rsa4096 {
    #[cfg(target_pointer_width = "32")]
    #[path = "arch/arch32.rs"]
    mod arch;
    #[cfg(target_pointer_width = "64")]
    #[path = "arch/arch64.rs"]
    mod arch;

    #[cfg(target_pointer_width = "32")]
    #[path = "roms/rom_rsa4096_32.rs"]
    mod rom;
    #[cfg(target_pointer_width = "64")]
    #[path = "roms/rom_rsa4096_64.rs"]
    mod rom;
    pub mod big;
    pub mod dbig;
    pub mod ff;
    pub mod rsa;
}