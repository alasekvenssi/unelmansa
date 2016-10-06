"use strict";
var Vec2_1 = require("../util/Vec2");
var bigCircle = (function () {
    function bigCircle(radius, position) {
        this.radius = radius;
        this.position = position;
    }
    return bigCircle;
}());
function isIntersecting(lhs, rhs) {
    // if(lhs instanceof Circle) {
    // code...
    // }
    return true;
}
/*function isIntersecting(lhs :Rectangular, rhs :Circle) {
    console.log(lhs.position, rhs.position);
}
*/
var x = new bigCircle(5, new Vec2_1.Vec2(1, 1));
var y = new bigCircle(2, new Vec2_1.Vec2(0, 0));
// console.log(instanceof bigCircle)
isIntersecting(x, y);
