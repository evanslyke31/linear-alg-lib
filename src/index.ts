// #region Supporting Linear Alg

import { Vector2 } from "./types/vector";

//https://www.desmos.com/calculator/c2wkore2bi
function LerpSmooth1D(x1: number, x2: number, p: number, rate: number, halfSmooth: boolean, infinite: boolean): number[] {
    if(infinite || p <= Math.PI * (halfSmooth ? .5 : 1)) {
        p += rate;
        return [((Math.sin(p + (1.5 * Math.PI))+1)*((x2-x1)/(halfSmooth ? 1 : 2)) + x1), p];
    }
    return [x2, p]
}

//fraction > 0; fraction = N
//0 <= fpos < fraction; fpos = N
//https://www.desmos.com/calculator/tbxtssvtcn
function fractionalLine(p1: Vector2, p2: Vector2, f: number, p: number): number[] {
    if(f <= 0 || p < 0 || p >= f)
        return [p1.x,p1.y,p2.x,p2.y];
    let dx = (p2.x - p1.x)/f;
    let dy = (p2.y - p1.y)/f;
    return [dx*p+p1.x,dy*p+p1.y,dx*(p+1)+p1.x,dy*(p+1)+p1.y];
}

// #region Oribital Mechanics

//https://www.desmos.com/calculator/vbsetpue7m
function eulerStep(p1: Vector2, p2: Vector2, v1: Vector2, v2: Vector2, G: number): Vector2[] {
    for(let i = 1; i <= 8; i++) {
        let dt = 1 / i;
        let acc1: Vector2 = acceleration(p2, p1, G);
        let acc2: Vector2 = acceleration(p1, p2, G);
        v1 = { x: v1.x + acc1.x * dt, y: v1.y + acc1.y * dt };
        v2 = { x: v2.x + acc2.x * dt, y: v2.y + acc2.y * dt };
        p1 = { x: p1.x + v1.x * dt, y: p1.y + v1.y * dt };
        p2 = { x: p2.x + v2.x * dt, y: p2.y + v2.y * dt };
    }
    return [p1, p2, v1, v2];
}

function acceleration(p1: Vector2, p2: Vector2, G: number): Vector2 {
    let direction: Vector2 = {x: p1.x - p2.x, y: p1.y - p2.y} 

    let length = Math.sqrt((direction.x * direction.x) + (direction.y * direction.y));

    let normal = {x: direction.x / length, y: direction.y / length};

    let constant = G/(length*length);

    return {x: normal.x*constant, y: normal.y*constant}
}

// #endregion


// #region Matrix Operations

function matMul(A: number[][], B: number[][]): number[][] | null {
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

// #region rotation 3D

function rotateX3(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]];
    return matMul(rotMatrix, A);
}

function rotateY3(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]];
    return matMul(rotMatrix, A);
}

function rotateZ3(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]];
    return matMul(rotMatrix, A);
}
// #endregion

// #region rotation 4D

function rotateX4(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [1, 0, 0,0],
        [0, Math.cos(angle), -Math.sin(angle),0],
        [0, Math.sin(angle), Math.cos(angle),0],[0,0,0,1]];
    return matMul(rotMatrix, A);
}

function rotateY4(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [Math.cos(angle), 0, Math.sin(angle),0],
        [0, 1, 0,0],
        [-Math.sin(angle), 0, Math.cos(angle),0],
        [0,0,0,1]];
    return matMul(rotMatrix, A);
}

function rotateZ4(A: number[][], angle: number): number[][] | null {
    let rotMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0], [0, 0, 0, 1]];
    return matMul(rotMatrix, A);
}

function rotateZW4(A: number[][], angle: number): number[][] | null {
    let rotationMatrix = [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]
    return matMul(rotationMatrix, A);
}

function rotateYW4(A: number[][], angle: number): number[][] | null {
    let rotationMatrix = [
        [Math.cos(angle), 0, -Math.sin(angle), 0],
        [0, 1, 0, 0],
        [Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1],
    ]
    return matMul(rotationMatrix, A);
}

function rotateYZ4(A: number[][], angle:number): number[][] | null {
    let rotationMatrix = [
        [Math.cos(angle), 0, 0, -Math.sin(angle)],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [Math.sin(angle), 0, 0, Math.cos(angle)],
    ]
    return matMul(rotationMatrix, A);
}

function rotateXW4(A:number[][], angle: number): number[][] | null {
    let rotationMatrix = [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1],
    ]
    return matMul(rotationMatrix, A);
}

function rotateXZ4(A: number[][], angle: number): number[][] | null {
    let rotationMatrix = [
        [1, 0, 0, 0],
        [0, Math.cos(angle), 0, -Math.sin(angle)],
        [0, 0, 1, 0],
        [0,  Math.sin(angle), 0, Math.cos(angle)],
    ]
    return matMul(rotationMatrix, A);
}

function rotateXY4(A: number[][], angle: number): number[][] | null {
    let rotationMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, Math.cos(angle), -Math.sin(angle)],
        [0, 0, Math.sin(angle), Math.cos(angle)],
    ]
    return matMul(rotationMatrix, A);
}

// #endregion

// #region Projection
 const project3 = (w: number): number[][] => [[w,0,0,0],[0,w,0,0],[0,0,w,0]];
 const project4 = (z: number): number[][] => [[z,0,0],[0,z,0]];
//#endregion

//#endregion