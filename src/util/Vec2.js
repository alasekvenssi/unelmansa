"use strict";
var Vec2 = (function () {
    function Vec2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (rhs) {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    };
    Vec2.prototype.substract = function (rhs) {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    };
    Vec2.prototype.multiply = function (rhs) {
        return new Vec2(this.x * rhs, this.y * rhs);
    };
    Vec2.prototype.divide = function (rhs) {
        return new Vec2(this.x / rhs, this.y / rhs);
    };
    Vec2.prototype.length = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vec2.prototype.distance = function (rhs) {
        return Math.sqrt(Math.pow((this.x - rhs.x), 2) + Math.pow((this.y - rhs.y), 2));
    };
    Vec2.prototype.dot = function (rhs) {
        return this.x * rhs.x + this.y * rhs.y;
    };
    Vec2.prototype.cross = function (rhs) {
        return this.x * rhs.y - this.y * rhs.x;
    };
    Vec2.prototype.parallelogramArea = function (rhs) {
        return Math.abs(this.cross(rhs));
    };
    Vec2.prototype.triangleArea = function (rhs) {
        return this.parallelogramArea(rhs) / 2;
    };
    Vec2.prototype.normal = function () {
        return this.divide(this.length());
    };
    return Vec2;
}());
exports.Vec2 = Vec2;
