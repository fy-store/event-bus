var A = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var s = (t, e, r) => (A(t, e, "read from private field"), r ? r.call(t) : e.get(t)), v = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, U = (t, e, r, o) => (A(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r);
var S = (t, e, r) => (A(t, e, "access private method"), r);
var ee = typeof global == "object" && global && global.Object === Object && global, le = typeof self == "object" && self && self.Object === Object && self, u = ee || le || Function("return this")(), g = u.Symbol, te = Object.prototype, ue = te.hasOwnProperty, fe = te.toString, w = g ? g.toStringTag : void 0;
function pe(t) {
  var e = ue.call(t, w), r = t[w];
  try {
    t[w] = void 0;
    var o = !0;
  } catch {
  }
  var n = fe.call(t);
  return o && (e ? t[w] = r : delete t[w]), n;
}
var be = Object.prototype, he = be.toString;
function ye(t) {
  return he.call(t);
}
var de = "[object Null]", ge = "[object Undefined]", K = g ? g.toStringTag : void 0;
function k(t) {
  return t == null ? t === void 0 ? ge : de : K && K in Object(t) ? pe(t) : ye(t);
}
function re(t) {
  return t != null && typeof t == "object";
}
function ne(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var me = "[object AsyncFunction]", ve = "[object Function]", we = "[object GeneratorFunction]", je = "[object Proxy]";
function Ee(t) {
  if (!ne(t))
    return !1;
  var e = k(t);
  return e == ve || e == we || e == me || e == je;
}
var _ = u["__core-js_shared__"], D = function() {
  var t = /[^.]+$/.exec(_ && _.keys && _.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function xe(t) {
  return !!D && D in t;
}
var Se = Function.prototype, Te = Se.toString;
function h(t) {
  if (t != null) {
    try {
      return Te.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var Oe = /[\\^$.*+?()[\]{}|]/g, ke = /^\[object .+?Constructor\]$/, Pe = Function.prototype, Ae = Object.prototype, _e = Pe.toString, Ie = Ae.hasOwnProperty, $e = RegExp(
  "^" + _e.call(Ie).replace(Oe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Re(t) {
  if (!ne(t) || xe(t))
    return !1;
  var e = Ee(t) ? $e : ke;
  return e.test(h(t));
}
function Fe(t, e) {
  return t == null ? void 0 : t[e];
}
function y(t, e) {
  var r = Fe(t, e);
  return Re(r) ? r : void 0;
}
var $ = y(u, "WeakMap");
(function() {
  try {
    var t = y(Object, "defineProperty");
    return t({}, "", {}), t;
  } catch {
  }
})();
var We = "[object Arguments]";
function G(t) {
  return re(t) && k(t) == We;
}
var oe = Object.prototype, Be = oe.hasOwnProperty, Me = oe.propertyIsEnumerable;
G(/* @__PURE__ */ function() {
  return arguments;
}());
var ie = typeof exports == "object" && exports && !exports.nodeType && exports, H = ie && typeof module == "object" && module && !module.nodeType && module, Ue = H && H.exports === ie, V = Ue ? u.Buffer : void 0;
V && V.isBuffer;
var se = typeof exports == "object" && exports && !exports.nodeType && exports, E = se && typeof module == "object" && module && !module.nodeType && module, Ke = E && E.exports === se, I = Ke && ee.process, m = function() {
  try {
    var t = E && E.require && E.require("util").types;
    return t || I && I.binding && I.binding("util");
  } catch {
  }
}();
m && m.isTypedArray;
y(Object, "create");
var R = y(u, "Map"), ce = typeof exports == "object" && exports && !exports.nodeType && exports, q = ce && typeof module == "object" && module && !module.nodeType && module, De = q && q.exports === ce, z = De ? u.Buffer : void 0;
z && z.allocUnsafe;
var F = y(u, "DataView"), W = y(u, "Promise"), B = y(u, "Set"), C = "[object Map]", Ge = "[object Object]", L = "[object Promise]", Q = "[object Set]", Y = "[object WeakMap]", J = "[object DataView]", He = h(F), Ve = h(R), qe = h(W), ze = h(B), Ce = h($), d = k;
(F && d(new F(new ArrayBuffer(1))) != J || R && d(new R()) != C || W && d(W.resolve()) != L || B && d(new B()) != Q || $ && d(new $()) != Y) && (d = function(t) {
  var e = k(t), r = e == Ge ? t.constructor : void 0, o = r ? h(r) : "";
  if (o)
    switch (o) {
      case He:
        return J;
      case Ve:
        return C;
      case qe:
        return L;
      case ze:
        return Q;
      case Ce:
        return Y;
    }
  return e;
});
u.Uint8Array;
var X = g ? g.prototype : void 0;
X && X.valueOf;
m && m.isMap;
m && m.isSet;
const p = (t) => t === null ? "null" : Array.isArray(t) ? "array" : typeof t, Le = Symbol("只读代理标识"), T = Symbol("代理数据:只读"), Qe = Symbol("解除只读代理包装"), Ye = Symbol("克隆数据只读代理数据"), j = (t, e = "default") => {
  let r = {};
  const o = p(e);
  if (o === "string")
    Z(e), r = {
      mode: e,
      unReadOnly: !1,
      repeatReadOnly: !1
    };
  else if (o === "object") {
    let n = e.mode;
    n === void 0 && (n = "default"), Z(n), r.mode = n, r.unReadOnly = !!e.unReadOnly, r.repeatReadOnly = !!e.repeatReadOnly, r.sign = e.sign;
  } else
    throw new TypeError('"options" must be a string or object');
  return Ze(t) && !r.repeatReadOnly ? t : new Proxy(t, {
    get(n, i) {
      if (i === T)
        return T;
      if (i === Le)
        return r.sign;
      if (i === Ye)
        return n;
      if (i === Qe) {
        if (r.unReadOnly)
          return n;
        throw new Error('The current data "options.unReadOnly" is false !');
      }
      const a = p(n[i]);
      return a === "function" ? r.mode === "default" ? n[i] === Array.prototype[Symbol.iterator] ? j(n[i], e) : j(n[i].bind(Je), e) : j(n[i].bind(n), e) : a === "object" || a === "array" ? j(n[i], e) : n[i];
    },
    set(n) {
      return console.warn(n, "The current data is read-only !"), !0;
    },
    deleteProperty(n) {
      return console.warn(n, "The current data is read-only !"), !0;
    },
    apply(n, i, a) {
      return r.mode === "strict" ? (console.warn(
        n,
        'The current data configuration "options.mode" is "strict" , "strict" mode prohibit calling functions !'
      ), !1) : typeof r.mode == "function" && !r.mode(n, i, a) ? !1 : n.apply(i, a);
    }
  });
}, Z = (t) => {
  const e = p(t), r = new TypeError('"options.mode" must be a "strict" | "default" | "looseFitting" | function !');
  if (e === "string") {
    if (!["strict", "default", "looseFitting"].includes(t))
      throw r;
    return;
  }
  if (e !== "function")
    throw r;
}, Je = new Proxy(
  {},
  {
    set(t, e) {
      return console.warn(
        e,
        'The current data configuration "options.mode" is "default" , cannot be changed data through "this" !'
      ), !0;
    }
  }
), Xe = ["object", "array", "function"], Ze = (t) => {
  const e = p(t);
  return !(!Xe.includes(e) || t[T] !== T);
}, N = {
  object: (t, e) => {
    if (!t.callback)
      throw new Error('"EventItem.callback" does not exist');
    return [
      {
        once: !!t.once,
        sign: Symbol(e.toString()),
        callback: t.callback
      }
    ];
  },
  function: (t, e) => [
    {
      once: !1,
      sign: Symbol(e.toString()),
      callback: t
    }
  ],
  array: (t, e) => t.map((r) => {
    if (typeof r == "function" && (r = {
      once: !1,
      sign: Symbol(e.toString()),
      callback: r
    }), p(r) !== "object")
      throw new Error('"events" item must be a EventItem');
    if (typeof r.callback != "function")
      throw new Error('"EventItem.callback" must be a function');
    return {
      once: !!r.once,
      sign: Symbol(e.toString()),
      callback: r.callback
    };
  })
};
var b, c, x, M, O, ae;
class et {
  /**
   * 发布订阅
   * - 详细使用方式请查阅文档
   * @param options 配置对象
   */
  constructor(e = {}) {
    v(this, x);
    /**
     * 删除一个事件(且移除该事件所有回调函数)
     * @param eventName 注册事件时的事件名
     */
    v(this, O);
    v(this, b, void 0);
    v(this, c, /* @__PURE__ */ new Map());
    if (p(e) !== "object")
      throw new TypeError('"options" must be a object');
    const { state: r = {}, events: o = {}, ctx: n } = e;
    if (p(r) !== "object")
      throw new TypeError('"state" must be a object');
    if (p(o) !== "object")
      throw new TypeError('"events" must be a object');
    U(this, b, r);
    const i = (a) => {
      let l = o[a];
      const f = p(l);
      if (!N[f])
        throw new TypeError('"events" item must be `EventItem`  or `EventItem[]` or `function`');
      const P = N[f].call(this, l, a);
      s(this, c).set(a, P);
    };
    if (Object.keys(o).forEach(i), Object.getOwnPropertySymbols(o).forEach(i), n) {
      const a = {
        eventBus: this,
        on: this.on.bind(this),
        once: this.once.bind(this),
        has: this.has.bind(this),
        hasSign: this.hasSign.bind(this),
        hasEvent: this.hasEvent.bind(this),
        emit: this.emit.bind(this),
        off: this.off.bind(this),
        removeEvent: S(this, O, ae).bind(this),
        state: s(this, b),
        events: s(this, c)
      };
      n.call(this, a);
    }
  }
  /**
   * 状态
   */
  get state() {
    return s(this, b);
  }
  /**
   * 解析后的事件对象, 此处仅用于提供类型推导(不允许操作)
   */
  get __events__() {
    return j(s(this, c), "strict");
  }
  /**
   * 注册自定义事件
   * @param eventName 事件名
   * @param callback 事件回调
   * @param desc 返回 symbol 的描述
   * @returns 唯一标识
   */
  on(e, r, o) {
    return S(this, x, M).call(this, e, !1, r, o);
  }
  /**
   * 注册自定义事件, 触发一次后即自动移除该事件
   * @param eventName 事件名
   * @param callback 事件回调
   * @param desc 返回 symbol 的描述
   * @returns 唯一标识
   */
  once(e, r, o) {
    return S(this, x, M).call(this, e, !0, r, o);
  }
  /**
   * 判断唯一标识是否存在
   * @param sign 唯一标识
   */
  hasSign(e) {
    const r = s(this, c).entries();
    for (const [, o] of r)
      if (o.findIndex((i) => i.sign === e) !== -1)
        return !0;
    return console.error(`Warning: off => "${String(e)}" does not exist`), !1;
  }
  /**
   * 判断该事件中该回调方法是否存在
   * @param eventName 事件名
   * @param callback 事件回调
   */
  has(e, r) {
    if (!(typeof e == "string" || typeof e == "symbol"))
      throw new TypeError('TypeError: "eventName" must be a string or symbol');
    if (typeof r != "function")
      throw new TypeError('TypeError: "callback" must be a function');
    if (!s(this, c).has(e))
      return !1;
    const o = s(this, c).get(e);
    return o.length === 0 ? !1 : !!o.find((n) => n.callback);
  }
  /**
   * 判断该事件是否存在
   * @param eventName 事件名
   */
  hasEvent(e) {
    if (!(typeof e == "string" || typeof e == "symbol"))
      throw new TypeError('TypeError: "eventName" must be a string or symbol');
    return s(this, c).has(e) ? s(this, c).get(e).length !== 0 : !1;
  }
  /**
   * 触发自定义事件
   * @param eventName 事件名或唯一标识
   * @param args 传递的参数
   */
  emit(e, ...r) {
    if (!s(this, c).has(e)) {
      const n = s(this, c).entries();
      for (const [i, a] of n) {
        const l = a.findIndex((f) => f.sign === e);
        if (l !== -1)
          return a[l].callback.call(this, s(this, b), ...r), a[l].once && (a.splice(l, 1), a.length === 0 && s(this, c).delete(i)), !0;
      }
      return console.error(`Warning: emit => "${String(e)}" does not exist`), !1;
    }
    const o = s(this, c).get(e);
    for (let n = 0; n < o.length; n++) {
      const i = o[n];
      i.callback.call(this, s(this, b), ...r), i.once && (o.splice(n, n + 1), n--);
    }
    return o.length === 0 && s(this, c).delete(e), !0;
  }
  /**
   * 取消一个事件回调
   * @param eventName 注册事件时的事件名
   * @param callback 注册事件时的回调函数
   */
  off(...e) {
    if (!e.length)
      throw new Error("No parameters passed !");
    const [r, o] = e;
    if (e.length === 1) {
      const n = s(this, c).entries();
      let i = !1;
      for (const [a, l] of n) {
        const f = l.findIndex((P) => P.sign === r);
        if (f !== -1) {
          i = !0, l.splice(f, 1), l.length === 0 && s(this, c).delete(a);
          break;
        }
      }
      if (!i)
        return console.error(`Warning: off => "${String(r)}" does not exist`), !1;
    } else {
      if (!s(this, c).has(r))
        return console.error(`Warning: off => "${String(r)}" does not exist`), !1;
      const n = s(this, c).get(r), i = n.findIndex((l) => l.callback === o);
      if (i === -1)
        return console.error('Warning: off => this "callback" does not exist'), !1;
      n.splice(i, 1);
      let a = !0;
      for (; a; ) {
        const l = n.findIndex((f) => f.callback === o);
        if (l === -1) {
          a = !1;
          break;
        }
        n.splice(l, 1);
      }
      n.length === 0 && s(this, c).delete(r);
    }
    return !0;
  }
}
b = new WeakMap(), c = new WeakMap(), x = new WeakSet(), M = function(e, r, o, n = "") {
  if (!(typeof e == "string" || typeof e == "symbol"))
    throw new TypeError('TypeError: "eventName" must be a string or symbol');
  if (typeof o != "function")
    throw new TypeError('TypeError: "callback" must be a function');
  if (typeof n != "string")
    throw new TypeError('TypeError: "desc" must be a string');
  s(this, c).has(e) || s(this, c).set(e, []);
  const i = Symbol(n || e.toString());
  return s(this, c).get(e).push({
    once: r,
    sign: i,
    callback: o
  }), i;
}, O = new WeakSet(), ae = function(e) {
  return s(this, c).has(e) ? s(this, c).delete(e) : (console.error(`Warning: removeEvent => "${String(e)}" does not exist`), !1);
};
export {
  et as default
};
