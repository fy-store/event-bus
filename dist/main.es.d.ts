/**
 * 状态
 */
export interface State {
    [key: string | symbol]: any;
}
export interface Callback {
    (state: State, ...args: any): this;
}
export interface EventItem {
    /**
     * 是否仅触发一次
     */
    once?: true | false;
    /**
     * 回调函数
     */
    callback: Callback;
}
export interface Events {
    [key: string | symbol]: EventItem | EventItem[] | Callback;
}
/**
 * 上下文对象
 */
export interface Ctx {
    /**
     * 类的实例
     */
    eventBus: EventBus;
    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on: (eventName: string | symbol, callback: Callback) => boolean;
    /**
     * 注册自定义事件, 触发一次后即移除该事件
     * - eventName 事件名
     * - callback 事件回调
     */
    once: (eventName: string | symbol, callback: Callback) => boolean;
    /**
     * 判断该事件中该回调方法是否存在
     * - eventName 事件名
     * - callback 事件回调
     */
    has: (eventName: string | symbol, callback: Callback) => boolean;
    /**
     * 判断该事件是否存在
     * - eventName 事件名
     */
    hasEvent: (eventName: string | symbol) => boolean;
    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit: (eventName: string | symbol, ...args: any) => boolean;
    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off: (eventName: string | symbol, callback: Callback) => boolean;
    /**
     * 删除一个事件(且移除该事件所有回调函数)
     * - eventName 注册事件时的事件名
     */
    removeEvent: (eventName: string | symbol) => boolean;
    /**
     * 状态数据
     */
    state: State;
    /**
     * 事件表
     */
    events: Map<string | symbol, EventItem[]>;
}
/**
 * 配置对象
 */
export interface Options {
    /**
     * 初始状态数据
     */
    state?: State;
    /**
     * 初始事件
     */
    events?: Events;
    /**
     * 用于获取上下文对象的函数
     * - 接收一个上下文对象
     */
    ctx?: (ctx: Ctx) => void;
}
/**
 * 事件总线
 */
export default class EventBus {
    #private;
    /**
     * 配置对象
     */
    constructor(options?: Options);
    /**
     * 状态对象
     */
    get state(): State;
    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on(eventName: string | symbol, callback: Callback): boolean;
    /**
     * 注册自定义事件, 触发一次后即移除该事件
     * - eventName 事件名
     * - callback 事件回调
     */
    once(eventName: string | symbol, callback: Callback): boolean;
    /**
     * 判断该事件中该回调方法是否存在
     * - eventName 事件名
     * - callback 事件回调
     */
    has(eventName: string | symbol, callback: Callback): boolean;
    /**
     * 判断该事件是否存在
     * - eventName 事件名
     */
    hasEvent(eventName: string | symbol): boolean;
    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit(eventName: string | symbol, ...args: any): boolean;
    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off(eventName: string | symbol, callback: Callback): boolean;
}
