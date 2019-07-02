const { CTX } = require("./ctx");
const { makeGeneratorsPF4 } = require("./util.spec");

describe("PAIR256Static", () => {
  const ctx = new CTX("BLS48");
  const { g1, g2 } = makeGeneratorsPF4(ctx);

  it("satisfies e(aP, bQ) == e(P,Q)^ab == e(bP, aQ)", () => {
    const rng = new ctx.RAND();
    const n = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Order);
    const a = ctx.BIG.randomnum(n, rng);
    const b = ctx.BIG.randomnum(n, rng);

    // Use arbitrary points P, Q. Must hold for all.
    const P = g1.mul(new ctx.BIG(5));
    const Q = g2.mul(new ctx.BIG(8));

    // e(aP, bQ) == e(bP, aQ)
    const aP = P.mul(a);
    const bQ = Q.mul(b);
    const aQ = Q.mul(a);
    const bP = P.mul(b);
    const eaPbQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(bQ, aP));
    const ebPaQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(aQ, bP));
    expect(eaPbQ).toEqual(ebPaQ);

    // e(aP, bQ) == e(P,Q)^ab
    const ePQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P));
    const ePGab = new ctx.FP48(ePQ).pow(a).pow(b);
    expect(eaPbQ).toEqual(ePGab);
  });

  it("satisfies e(P+R,Q) == e(P,Q)*e(R,Q)", () => {
    // Use arbitrary points P, R, Q. Must hold for all.
    const P = g1.mul(new ctx.BIG(5));
    const R = g1.mul(new ctx.BIG(42));
    const Q = g2.mul(new ctx.BIG(8));

    const PR = new ctx.ECP();
    PR.copy(P);
    PR.add(R);

    const ePRQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, PR));
    const ePQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P));
    const eRQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, R));

    const ePQeRQ = new ctx.FP48(ePQ); // the product e(P,Q)*e(R,Q)
    ePQeRQ.mul(eRQ);
    expect(ePRQ.equals(ePQeRQ)).toEqual(true);
  });

  it("satisfies e(P+0,Q) == e(P,Q)*e(0,Q)", () => {
    // Use arbitrary points P, Q and R=0.
    const P = g1.mul(new ctx.BIG(5));
    const R = new ctx.ECP();
    const Q = g2.mul(new ctx.BIG(8));

    const PR = new ctx.ECP();
    PR.copy(P);
    PR.add(R);

    const ePRQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, PR));
    const ePQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P));
    const eRQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, R));

    const ePQeRQ = new ctx.FP48(ePQ); // the product e(P,Q)*e(R,Q)
    ePQeRQ.mul(eRQ);
    expect(ePRQ.equals(ePQeRQ)).toEqual(true);
  });

  it("satisfies e(P,Q+R) == e(P,Q)*e(P,R)", () => {
    // Use arbitrary points P, Q, R. Must hold for all.
    const P = g1.mul(new ctx.BIG(5));
    const Q = g2.mul(new ctx.BIG(8));
    const R = g2.mul(new ctx.BIG(42));

    const QR = new ctx.ECP8();
    QR.copy(Q);
    QR.add(R);

    const ePQR = ctx.PAIR256.fexp(ctx.PAIR256.ate(QR, P));
    const ePQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P));
    const ePR = ctx.PAIR256.fexp(ctx.PAIR256.ate(R, P));

    const ePQePR = new ctx.FP48(ePQ); // the product e(P,Q)*e(P,R)
    ePQePR.mul(ePR);
    expect(ePQR.equals(ePQePR)).toEqual(true);
  });

  it("satisfies e(P,Q+0) == e(P,Q)*e(P,0)", () => {
    // Use arbitrary points P, Q and R=0.
    const P = g1.mul(new ctx.BIG(5));
    const Q = g2.mul(new ctx.BIG(8));
    const R = new ctx.ECP8();

    const QR = new ctx.ECP8();
    QR.copy(Q);
    QR.add(R);

    const ePQR = ctx.PAIR256.fexp(ctx.PAIR256.ate(QR, P));
    const ePQ = ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P));
    const ePR = ctx.PAIR256.fexp(ctx.PAIR256.ate(R, P));

    const ePQePR = new ctx.FP48(ePQ); // the product e(P,Q)*e(P,R)
    ePQePR.mul(ePR);
    expect(ePQR.equals(ePQePR)).toEqual(true);
  });

  it("satisfies e(P,0) == 1", () => {
    const P = g1.mul(new ctx.BIG(5));
    const Q = new ctx.ECP8();
    expect(ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P)).isunity()).toEqual(true);
  });

  it("satisfies e(0,Q) == 1", () => {
    const P = new ctx.ECP();
    const Q = g2.mul(new ctx.BIG(8));
    expect(ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P)).isunity()).toEqual(true);
  });

  it("satisfies e(0,0) == 1", () => {
    const P = new ctx.ECP();
    const Q = new ctx.ECP8();
    expect(ctx.PAIR256.fexp(ctx.PAIR256.ate(Q, P)).isunity()).toEqual(true);
  });

  it("satisfies e(g1, g2) != 1", () => {
    const eg1g2 = ctx.PAIR256.fexp(ctx.PAIR256.ate(g2, g1));
    expect(eg1g2.isunity()).toEqual(false);
  });
});
