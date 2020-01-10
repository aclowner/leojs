/**
 * 二维向量类
 * @param x(number) x轴坐标
 * @param y(number) y轴坐标
 * @return (Vector2) 返回值
 */
Vector2.prototype = Object.create(PIXI.Point.prototype);
function Vector2(x, y) {
    PIXI.Point.call(this);
    /**
     * 属性，返回x轴大小。
     */
    this.x = x;

    /**
     * 属性，返回y轴大小。
     */
    this.y = y;

    //实例属性
    Object.defineProperties(this, {
        normalized  : {
            get() {return this.x == 0 && this.y == 0 ? Vector2.zero : this.Div(this.magnitude);}
        },
        magnitude   : {
            get() {return Math.sqrt(this.sqrMagnitude);}
        },
        sqrMagnitude: {
            get() {return this.x*this.x+this.y*this.y;}
        },
        negtive:{
            get(){return this.Mul(-1);}
        }
    })
}

//静态属性
Object.defineProperties(Vector2, {
    //返回一个初始值为1,1的向量。
    zero   : {get() {return new Vector2(0, 0)}},
    //返回一个初始值为0,0的向量。
    one    : {get() {return new Vector2(1, 1)}},
    //Y轴正方向
    forward: {get() {return new Vector2(0, 1)}},
    //X轴正方向
    right  : {get() {return new Vector2(1, 0)}}
})

/**
 * 计算两点之间距离
 * @param v1(Vector2) 第一个点
 * @param v2(Vector2) 第二个点
 * @return (number) 结果
 */
Vector2.Distance = function (v1, v2) {return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);}

/**
 * 向量点积
 * @param v1
 * @param v2
 * @returns {number}
 * @constructor
 */
Vector2.Dot = function (v1, v2) {return (v1.x * v2.x) + (v1.y * v2.y);}

/**
 * 求向量间夹角
 * @param from
 * @param to
 * @returns {number}
 * @constructor
 */
Vector2.Angle = function (from, to) {
    var num = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
    if (num < 1E-15) {return 0;}
    return (Math.acos(Math.clamp(Vector2.Dot(from, to) / num, -1, 1)) * 57.29578);
};

/**
 * 带方向夹角
 * @param from
 * @param to
 * @returns {number}
 * @constructor
 */
Vector2.SignedAngle = function(from, to){
    var num = Vector2.Angle(from, to);
    var num2 = Math.sign((from.x * to.y) - (from.y * to.x));
    return (num * num2);
};

/**
 * 以inNormal为法线的inDirection反射向量
 * @param inDirection
 * @param inNormal
 * @returns {Vector2}
 * @constructor
 */
Vector2.Reflect = function (inDirection, inNormal) {
    return inNormal.Mul(-2 * Vector2.Dot(inNormal, inDirection)).Add(inDirection);
}

/**
 * 以指定距离从指定位置向目标位置移动
 * @param current
 * @param target
 * @param maxDistanceDelta
 * @returns {Vector2}
 * @constructor
 */
Vector2.MoveTowards = function (current, target, maxDistanceDelta) {
    var v         = target.Sub(current);
    var magnitude = v.magnitude;
    if ((magnitude <= maxDistanceDelta) || (magnitude == 0)) {return target}
    return current.Add(v.Div(magnitude).Mul(maxDistanceDelta));
}

/**
 * 判断两个向量是否相等
 * @param va
 * @param vb
 * @returns {boolean}
 * @constructor
 */
Vector2.Equals = function (va, vb) {
    return va.x == vb.x && va.y == vb.y;
}

/**
 * 设置x, y值
 * @param x
 * @param y
 * @constructor
 */
Vector2.prototype.Set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
}

/**
 * 两个Vector2分量分别相加
 * @param v1(Vector2) 第一个点
 * @param v2(Vector2) 第二个点
 * @return (Vector2) 结果
 */
Vector2.prototype.Add = function (a, b) {
    if (b == null) {
        return new Vector2(this.x + a.x, this.y + a.y);
    } else {
        return new Vector2(this.x + a, this.y + b);
    }
}

/**
 * 两个Vector2分量分别相减
 * @param v1(Vector2) 第一个点
 * @param v2(Vector2) 第二个点
 * @return (Vector2) 结果
 */
Vector2.prototype.Sub = function (a, b) {
    if (b == null) {
        return new Vector2(this.x - a.x, this.y - a.y);
    } else {
        return new Vector2(this.x - a, this.y - b);
    }
}

/**
 * 将向量除以一个数
 * @param v1(Vector2) 被除向量
 * @param f(number)  除数
 * @return (Vector2) 结果
 */
Vector2.prototype.Div = function (f) {
    return new Vector2(this.x / f, this.y / f);
}

/**
 * 将向量乘以一个数
 * @param v1(Vector2) 向量
 * @param f(number)  乘数
 * @return (Vector2) 结果
 */
Vector2.prototype.Mul = function (f) {
    return new Vector2(this.x * f, this.y * f);
}

Vector2.prototype.ToString = function () {
    return (this.x + "," + this.y);
}