function makeGeneratorsPF12(ctx) {
  const g1 = new ctx.ECP();
  const g1x = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gx);

  if (ctx.ECP.CURVETYPE !== ctx.ECP.MONTGOMERY) {
    const g1y = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(g1x, g1y);
  } else {
    g1.setx(g1x);
  }

  // Get generator g2 for G2
  const [xa, xb] = [new ctx.FP(), new ctx.FP()];
  xa.rcopy(ctx.ROM_CURVE.CURVE_Pxa);
  xb.rcopy(ctx.ROM_CURVE.CURVE_Pxb);
  const g2x = new ctx.FP2(xa, xb);

  const [ya, yb] = [new ctx.FP(), new ctx.FP()];
  ya.rcopy(ctx.ROM_CURVE.CURVE_Pya);
  yb.rcopy(ctx.ROM_CURVE.CURVE_Pyb);
  const g2y = new ctx.FP2(ya, yb);

  const g2 = new ctx.ECP2();
  g2.setxy(g2x, g2y);

  return { g1, g2 };
}

function makeGeneratorsPF3(ctx) {
  const g1 = new ctx.ECP();
  const g1x = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gx);

  if (ctx.ECP.CURVETYPE !== ctx.ECP.MONTGOMERY) {
    const g1y = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(g1x, g1y);
  } else {
    g1.setx(g1x);
  }

  // Get generator g2 for G2
  const [xaa, xab, xba, xbb] = [new ctx.FP(), new ctx.FP(), new ctx.FP(), new ctx.FP()];
  xaa.rcopy(ctx.ROM_CURVE.CURVE_Pxaa);
  xab.rcopy(ctx.ROM_CURVE.CURVE_Pxab);
  xba.rcopy(ctx.ROM_CURVE.CURVE_Pxba);
  xbb.rcopy(ctx.ROM_CURVE.CURVE_Pxbb);
  const g2x = new ctx.FP4(new ctx.FP2(xaa, xab), new ctx.FP2(xba, xbb));

  const [yaa, yab, yba, ybb] = [new ctx.FP(), new ctx.FP(), new ctx.FP(), new ctx.FP()];
  yaa.rcopy(ctx.ROM_CURVE.CURVE_Pyaa);
  yab.rcopy(ctx.ROM_CURVE.CURVE_Pyab);
  yba.rcopy(ctx.ROM_CURVE.CURVE_Pyba);
  ybb.rcopy(ctx.ROM_CURVE.CURVE_Pybb);
  const g2y = new ctx.FP4(new ctx.FP2(yaa, yab), new ctx.FP2(yba, ybb));

  const g2 = new ctx.ECP4();
  g2.setxy(g2x, g2y);

  return { g1, g2 };
}

function makeGeneratorsPF4(ctx) {
  const g1 = new ctx.ECP();
  const g1x = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gx);

  if (ctx.ECP.CURVETYPE !== ctx.ECP.MONTGOMERY) {
    const g1y = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(g1x, g1y);
  } else {
    g1.setx(g1x);
  }

  // Get generator g2 for G2
  const [xaaa, xaab, xaba, xabb, xbaa, xbab, xbba, xbbb] = [
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
  ];
  xaaa.rcopy(ctx.ROM_CURVE.CURVE_Pxaaa);
  xaab.rcopy(ctx.ROM_CURVE.CURVE_Pxaab);
  xaba.rcopy(ctx.ROM_CURVE.CURVE_Pxaba);
  xabb.rcopy(ctx.ROM_CURVE.CURVE_Pxabb);
  xbaa.rcopy(ctx.ROM_CURVE.CURVE_Pxbaa);
  xbab.rcopy(ctx.ROM_CURVE.CURVE_Pxbab);
  xbba.rcopy(ctx.ROM_CURVE.CURVE_Pxbba);
  xbbb.rcopy(ctx.ROM_CURVE.CURVE_Pxbbb);
  const g2x = new ctx.FP8(
    new ctx.FP4(new ctx.FP2(xaaa, xaab), new ctx.FP2(xaba, xabb)),
    new ctx.FP4(new ctx.FP2(xbaa, xbab), new ctx.FP2(xbba, xbbb))
  );

  const [yaaa, yaab, yaba, yabb, ybaa, ybab, ybba, ybbb] = [
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
    new ctx.FP(),
  ];
  yaaa.rcopy(ctx.ROM_CURVE.CURVE_Pyaaa);
  yaab.rcopy(ctx.ROM_CURVE.CURVE_Pyaab);
  yaba.rcopy(ctx.ROM_CURVE.CURVE_Pyaba);
  yabb.rcopy(ctx.ROM_CURVE.CURVE_Pyabb);
  ybaa.rcopy(ctx.ROM_CURVE.CURVE_Pybaa);
  ybab.rcopy(ctx.ROM_CURVE.CURVE_Pybab);
  ybba.rcopy(ctx.ROM_CURVE.CURVE_Pybba);
  ybbb.rcopy(ctx.ROM_CURVE.CURVE_Pybbb);
  const g2y = new ctx.FP8(
    new ctx.FP4(new ctx.FP2(yaaa, yaab), new ctx.FP2(yaba, yabb)),
    new ctx.FP4(new ctx.FP2(ybaa, ybab), new ctx.FP2(ybba, ybbb))
  );

  const g2 = new ctx.ECP8();
  g2.setxy(g2x, g2y);

  return { g1, g2 };
}

// CommonJS module exports
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports.makeGeneratorsPF12 = makeGeneratorsPF12;
  module.exports.makeGeneratorsPF3 = makeGeneratorsPF3;
  module.exports.makeGeneratorsPF4 = makeGeneratorsPF4;
}
