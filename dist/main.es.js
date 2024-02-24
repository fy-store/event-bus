var p = (r, t, e) => {
  if (!t.has(r))
    throw TypeError("Cannot " + e);
};
var n = (r, t, e) => (p(r, t, "read from private field"), e ? e.call(r) : t.get(r)), a = (r, t, e) => {
  if (t.has(r))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(r) : t.set(r, e);
}, m = (r, t, e, s) => (p(r, t, "write to private field"), s ? s.call(r, e) : t.set(r, e), e);
var b = (r, t, e) => (p(r, t, "access private method"), e);
const h = (r) => r === null ? "null" : Array.isArray(r) ? "array" : typeof r, d = {
  object: (r) => {
    if (!r.callback)
      throw new Error('"EventItem.callback" does not exist');
    return [
      {
        once: !!r.once,
        callback: r.callback
      }
    ];
  },
  function: (r) => [
    {
      once: !1,
      callback: r
    }
  ],
  array: (r) => r.map((t) => {
    if (typeof t == "function" && (t = {
      once: !1,
      callback: t
    }), h(t) !== "object")
      throw new Error('"events" item must be a EventItem');
    if (typeof t.callback != "function")
      throw new Error('"EventItem.callback" must be a function');
    return {
      once: !!t.once,
      callback: t.callback
    };
  })
};
var o, f, l, E, y, T;
class j {
  /**
   * 配置对象
   */
  constructor(t = {}) {
    a(this, l);
    /**
     * 删除一个事件(且移除该事件所有回调函数)
     * - eventName 注册事件时的事件名
     */
    a(this, y);
    /**
     * 事件表
     */
    a(this, o, /* @__PURE__ */ new Map());
    /**
     * 状态数据
     */
    a(this, f, void 0);
    if (h(t) !== "object")
      throw new TypeError('"options" must be a object');
    const { state: e = {}, events: s = {}, ctx: i } = t;
    if (h(e) !== "object")
      throw new TypeError('"state" must be a object');
    if (h(s) !== "object")
      throw new TypeError('"events" must be a object');
    m(this, f, e);
    const c = (u) => {
      let w = s[u];
      const g = h(w);
      if (!d[g])
        throw new TypeError('"events" item must be `EventItem`  or `EventItem[]` or `function`');
      n(this, o).set(u, d[g].call(this, w));
    };
    if (Object.keys(s).forEach(c), Object.getOwnPropertySymbols(s).forEach(c), i) {
      const u = {
        eventBus: this,
        on: this.on.bind(this),
        once: this.once.bind(this),
        has: this.has.bind(this),
        hasEvent: this.hasEvent.bind(this),
        emit: this.emit.bind(this),
        off: this.off.bind(this),
        removeEvent: b(this, y, T).bind(this),
        state: n(this, f),
        events: n(this, o)
      };
      i.call(this, u);
    }
  }
  /**
   * 状态对象
   */
  get state() {
    return n(this, f);
  }
  /**
   * 注册自定义事件
   * - eventName 事件名
   * - callback 事件回调
   */
  on(t, e) {
    return b(this, l, E).call(this, t, !1, e);
  }
  /**
   * 注册自定义事件, 触发一次后即移除该事件
   * - eventName 事件名
   * - callback 事件回调
   */
  once(t, e) {
    return b(this, l, E).call(this, t, !0, e);
  }
  /**
   * 判断该事件中该回调方法是否存在
   * - eventName 事件名
   * - callback 事件回调
   */
  has(t, e) {
    if (!(typeof t == "string" || typeof t == "symbol"))
      throw new TypeError('TypeError: "eventName" must be a string or symbol');
    if (typeof e != "function")
      throw new TypeError('TypeError: "callback" must be a function');
    if (!n(this, o).has(t))
      return !1;
    const s = n(this, o).get(t);
    return s.length === 0 ? !1 : !!s.find((i) => i.callback);
  }
  /**
   * 判断该事件是否存在
   * - eventName 事件名
   */
  hasEvent(t) {
    if (!(typeof t == "string" || typeof t == "symbol"))
      throw new TypeError('TypeError: "eventName" must be a string or symbol');
    return n(this, o).has(t) ? n(this, o).get(t).length !== 0 : !1;
  }
  /**
   * 触发自定义事件
   * - eventName 事件名
   * - args 传递的参数
   */
  emit(t, ...e) {
    if (!n(this, o).has(t))
      return console.error(`Warning: emit => "${String(t)}" does not exist`), !1;
    const s = n(this, o).get(t);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      c.callback.call(this, n(this, f), ...e), c.once && (s.splice(i, i + 1), i--);
    }
    return s.length === 0 && n(this, o).delete(t), !0;
  }
  /**
   * 取消一个事件回调
   * - eventName 注册事件时的事件名
   * - callback 注册事件时的回调函数
   */
  off(t, e) {
    if (!n(this, o).has(t))
      return console.error(`Warning: off => "${String(t)}" does not exist`), !1;
    if (typeof e != "function")
      throw new TypeError('TypeError: "callback" must be a function');
    const s = n(this, o).get(t), i = s.findIndex((c) => c.callback === e);
    return i === -1 ? (console.error('Warning: off => this "callback" does not exist'), !1) : (s.splice(i, 1), s.length === 0 && n(this, o).delete(t), !0);
  }
}
o = new WeakMap(), f = new WeakMap(), l = new WeakSet(), E = function(t, e, s) {
  if (!(typeof t == "string" || typeof t == "symbol"))
    throw new TypeError('TypeError: "eventName" must be a string or symbol');
  if (typeof s != "function")
    throw new TypeError('TypeError: "callback" must be a function');
  return n(this, o).has(t) || n(this, o).set(t, []), n(this, o).get(t).push({
    once: e,
    callback: s
  }), !0;
}, y = new WeakSet(), T = function(t) {
  return n(this, o).has(t) ? n(this, o).delete(t) : (console.error(`Warning: removeEvent => "${String(t)}" does not exist`), !1);
};
export {
  j as default
};
