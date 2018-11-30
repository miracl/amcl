pub enum ModType {
    NOT_SPECIAL,
    PSEUDO_MERSENNE,
    MONTGOMERY_FRIENDLY,
    GENERALISED_MERSENNE,
}

pub enum CurveType {
    EDWARDS,
    WEIERSTRASS,
    MONTGOMERY,
}

pub enum CurvePairingType {
    NOT,
    BN,
    BLS,
}

pub enum SexticTwist {
    NOT,
    D_TYPE,
    M_TYPE,
}

pub enum SignOfX {
    NOT,
    POSITIVEX,
    NEGATIVEX,
}