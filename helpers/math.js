exports.nearestPowerOf2 = function (n){
    return 1 << 31 - Math.clz32(n);
}