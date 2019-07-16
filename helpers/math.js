module.exports = function nearestPowerOf2(n) {
    return 1 << 31 - Math.clz32(n);
};
