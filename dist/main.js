const isType = (data) => {
    if (data === null)
        return 'null';
    if (Array.isArray(data))
        return 'array';
    return typeof data;
};
const mapHandler = {
    object: (item) => {
        if (!item.callback) {
            throw new Error('"EventItem.callback" does not exist');
        }
        return [
            {
                once: !!item.once,
                callback: item.callback
            }
        ];
    },
    function: (item) => {
        return [
            {
                once: false,
                callback: item
            }
        ];
    },
    array: (item) => {
        return item.map((el) => {
            if (typeof el === 'function') {
                el = {
                    once: false,
                    callback: el
                };
            }
            if (isType(el) !== 'object') {
                throw new Error('"events" item must be a EventItem');
            }
            if (typeof el.callback !== 'function') {
                throw new Error('"EventItem.callback" must be a function');
            }
            return {
                once: !!el.once,
                callback: el.callback
            };
        });
    }
};
/**
 * 事件总线
 */
export default class EventBus {
    /**
     * 事件表
     */
    #eventMap = new Map();
    /**
     * 状态数据
     */
    #state;
    /**
     * 配置对象
     */
    constructor(options = {}) {
        if (isType(options) !== 'object') {
            throw new TypeError('"options" must be a object');
        }
        const { state = {}, events = {}, ctx } = options;
        if (isType(state) !== 'object') {
            throw new TypeError('"state" must be a object');
        }
        if (isType(events) !== 'object') {
            throw new TypeError('"events" must be a object');
        }
        this.#state = state;
        const handler = (key) => {
            let item = events[key];
            const type = isType(item);
            if (!mapHandler[type]) {
                throw new TypeError('"events" item must be `EventItem`  or `EventItem[]` or `function`');
            }
            // @ts-ignore
            this.#eventMap.set(key, mapHandler[type].call(this, item));
        };
        Object.keys(events).forEach(handler);
        Object.getOwnPropertySymbols(events).forEach(handler);
        if (ctx) {
            const ctxParams = {
                eventBus: this,
                on: this.on.bind(this),
                once: this.once.bind(this),
                has: this.has.bind(this),
                hasEvent: this.hasEvent.bind(this),
                emit: this.emit.bind(this),
                off: this.off.bind(this),
                removeEvent: this.#removeEvent.bind(this),
                state: this.#state,
                events: this.#eventMap
            };
            ctx.call(this, ctxParams);
        }
    }
    /**
     * 状态对象
     */
    get state() {
        return this.#state;
    }
    #on(eventName, once, callback) {
        if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
            throw new TypeError('TypeError: "eventName" must be a string or symbol');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('TypeError: "callback" must be a function');
        }
        if (!this.#eventMap.has(eventName)) {
            this.#eventMap.set(eventName, []);
        }
        this.#eventMap.get(eventName).push({
            once,
            callback
        });
        return true;
    }
    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on(eventName, callback) {
        return this.#on(eventName, false, callback);
    }
    /**
     * 注册自定义事件, 触发一次后即移除该事件
     * - eventName 事件名
     * - callback 事件回调
     */
    once(eventName, callback) {
        return this.#on(eventName, true, callback);
    }
    /**
     * 判断该事件中该回调方法是否存在
     * - eventName 事件名
     * - callback 事件回调
     */
    has(eventName, callback) {
        if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
            throw new TypeError('TypeError: "eventName" must be a string or symbol');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('TypeError: "callback" must be a function');
        }
        if (!this.#eventMap.has(eventName))
            return false;
        const eventList = this.#eventMap.get(eventName);
        if (eventList.length === 0)
            return false;
        return !!eventList.find((item) => item.callback);
    }
    /**
     * 判断该事件是否存在
     * - eventName 事件名
     */
    hasEvent(eventName) {
        if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
            throw new TypeError('TypeError: "eventName" must be a string or symbol');
        }
        if (!this.#eventMap.has(eventName))
            return false;
        return this.#eventMap.get(eventName).length === 0 ? false : true;
    }
    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit(eventName, ...args) {
        if (!this.#eventMap.has(eventName)) {
            console.error(`Warning: emit => "${String(eventName)}" does not exist`);
            return false;
        }
        const eventList = this.#eventMap.get(eventName);
        for (let i = 0; i < eventList.length; i++) {
            const item = eventList[i];
            item.callback.call(this, this.#state, ...args);
            if (item.once) {
                eventList.splice(i, i + 1);
                i--;
            }
        }
        if (eventList.length === 0) {
            this.#eventMap.delete(eventName);
        }
        return true;
    }
    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off(eventName, callback) {
        if (!this.#eventMap.has(eventName)) {
            console.error(`Warning: off => "${String(eventName)}" does not exist`);
            return false;
        }
        if (typeof callback !== 'function') {
            throw new TypeError('TypeError: "callback" must be a function');
        }
        const list = this.#eventMap.get(eventName);
        const i = list.findIndex((item) => item.callback === callback);
        if (i === -1) {
            console.error(`Warning: off => this "callback" does not exist`);
            return false;
        }
        list.splice(i, 1);
        if (list.length === 0) {
            this.#eventMap.delete(eventName);
        }
        return true;
    }
    /**
     * 删除一个事件(且移除该事件所有回调函数)
     * - eventName 注册事件时的事件名
     */
    #removeEvent(eventName) {
        if (!this.#eventMap.has(eventName)) {
            console.error(`Warning: removeEvent => "${String(eventName)}" does not exist`);
            return false;
        }
        return this.#eventMap.delete(eventName);
    }
}
