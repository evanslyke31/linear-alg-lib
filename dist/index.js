"use strict";
// #region Supporting Linear Alg
Object.defineProperty(exports, "__esModule", { value: true });
exports.project4 = exports.project3 = exports.rotateXY4 = exports.rotateXZ4 = exports.rotateXW4 = exports.rotateYZ4 = exports.rotateYW4 = exports.rotateZW4 = exports.rotateZ4 = exports.rotateX4 = exports.rotateZ3 = exports.rotateY3 = exports.rotateX3 = exports.matMul = exports.acceleration = exports.eulerStep = exports.fractionalLine = exports.LerpSmooth1D = void 0;
//https://www.desmos.com/calculator/c2wkore2bi
function LerpSmooth1D(x1, x2, p, rate, halfSmooth, infinite) {
    if (infinite || p <= Math.PI * (halfSmooth ? .5 : 1)) {
        p += rate;
        return [((Math.sin(p + (1.5 * Math.PI)) + 1) * ((x2 - x1) / (halfSmooth ? 1 : 2)) + x1), p];
    }
    return [x2, p];
}
exports.LerpSmooth1D = LerpSmooth1D;
//fraction > 0; fraction = N
//0 <= fpos < fraction; fpos = N
//https://www.desmos.com/calculator/tbxtssvtcn
function fractionalLine(p1, p2, f, p) {
    if (f <= 0 || p < 0 || p >= f)
        return [p1.x, p1.y, p2.x, p2.y];
    var dx = (p2.x - p1.x) / f;
    var dy = (p2.y - p1.y) / f;
    return [dx * p + p1.x, dy * p + p1.y, dx * (p + 1) + p1.x, dy * (p + 1) + p1.y];
}
exports.fractionalLine = fractionalLine;
// #region Oribital Mechanics
//https://www.desmos.com/calculator/vbsetpue7m
function eulerStep(p1, p2, v1, v2, G) {
    for (var i = 1; i <= 8; i++) {
        var dt = 1 / i;
        var acc1 = acceleration(p2, p1, G);
        var acc2 = acceleration(p1, p2, G);
        v1 = { x: v1.x + acc1.x * dt, y: v1.y + acc1.y * dt };
        v2 = { x: v2.x + acc2.x * dt, y: v2.y + acc2.y * dt };
        p1 = { x: p1.x + v1.x * dt, y: p1.y + v1.y * dt };
        p2 = { x: p2.x + v2.x * dt, y: p2.y + v2.y * dt };
    }
    return [p1, p2, v1, v2];
}
exports.eulerStep = eulerStep;
function acceleration(p1, p2, G) {
    var direction = { x: p1.x - p2.x, y: p1.y - p2.y };
    var length = Math.sqrt((direction.x * direction.x) + (direction.y * direction.y));
    var normal = { x: direction.x / length, y: direction.y / length };
    var constant = G / (length * length);
    return { x: normal.x * constant, y: normal.y * constant };
}
exports.acceleration = acceleration;
// #endregion
// #region Matrix Operations
function matMul(A, B) {
    if (A[0].length != B.length)
        return null;
    var X = new Array(A.length);
    for (var i = 0; i < A.length; i++) {
        X[i] = new Array(B[0].length);
        for (var j = 0; j < B[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < A[0].length; k++)
                sum += A[i][k] * B[k][j];
            X[i][j] = sum;
        }
    }
    return X;
}
exports.matMul = matMul;
// #region rotation 3D
function rotateX3(A, angle) {
    var rotMatrix = [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ];
    return matMul(rotMatrix, A);
}
exports.rotateX3 = rotateX3;
function rotateY3(A, angle) {
    var rotMatrix = [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ];
    return matMul(rotMatrix, A);
}
exports.rotateY3 = rotateY3;
function rotateZ3(A, angle) {
    var rotMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ];
    return matMul(rotMatrix, A);
}
exports.rotateZ3 = rotateZ3;
// #endregion
// #region rotation 4D
function rotateX4(A, angle) {
    var rotMatrix = [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0], [0, 0, 0, 1]
    ];
    return matMul(rotMatrix, A);
}
exports.rotateX4 = rotateX4;
function rotateY4(A, angle) {
    var rotMatrix = [
        [Math.cos(angle), 0, Math.sin(angle), 0],
        [0, 1, 0, 0],
        [-Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1]
    ];
    return matMul(rotMatrix, A);
}
function rotateZ4(A, angle) {
    var rotMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0], [0, 0, 0, 1]
    ];
    return matMul(rotMatrix, A);
}
exports.rotateZ4 = rotateZ4;
function rotateZW4(A, angle) {
    var rotationMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateZW4 = rotateZW4;
function rotateYW4(A, angle) {
    var rotationMatrix = [
        [Math.cos(angle), 0, -Math.sin(angle), 0],
        [0, 1, 0, 0],
        [Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateYW4 = rotateYW4;
function rotateYZ4(A, angle) {
    var rotationMatrix = [
        [Math.cos(angle), 0, 0, -Math.sin(angle)],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [Math.sin(angle), 0, 0, Math.cos(angle)],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateYZ4 = rotateYZ4;
function rotateXW4(A, angle) {
    var rotationMatrix = [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateXW4 = rotateXW4;
function rotateXZ4(A, angle) {
    var rotationMatrix = [
        [1, 0, 0, 0],
        [0, Math.cos(angle), 0, -Math.sin(angle)],
        [0, 0, 1, 0],
        [0, Math.sin(angle), 0, Math.cos(angle)],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateXZ4 = rotateXZ4;
function rotateXY4(A, angle) {
    var rotationMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, Math.cos(angle), -Math.sin(angle)],
        [0, 0, Math.sin(angle), Math.cos(angle)],
    ];
    return matMul(rotationMatrix, A);
}
exports.rotateXY4 = rotateXY4;
// #endregion
// #region Projection
var project3 = function (w) { return [[w, 0, 0, 0], [0, w, 0, 0], [0, 0, w, 0]]; };
exports.project3 = project3;
var project4 = function (z) { return [[z, 0, 0], [0, z, 0]]; };
exports.project4 = project4;
//#endregion
//#endregion
//# sourceMappingURL=index.js.map