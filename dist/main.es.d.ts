import { TOptions, TEvent, TCallback, GetMapKeys } from './types/index.js';

/**
 * 发布订阅
 * - 详细使用方式请查阅文档
 */
export default class EventBus<S> {
    #private;
    /**
     * 发布订阅
     * - 详细使用方式请查阅文档
     * @param options 配置对象
     */
    constructor(options?: TOptions<S>);
    /**
     * 状态
     */
    get state(): S;
    /**
     * 解析后的事件对象, 此处仅用于提供类型推导(不允许操作)
     */
    get __events__(): Map<string | symbol, TEvent<S>[]>;
    /**
     * 注册自定义事件
     * @param eventName 事件名
     * @param callback 事件回调
     * @param desc 返回 symbol 的描述
     * @returns 唯一标识
     */
    on(eventName: string | symbol, callback: TCallback<S>, desc?: string): symbol;
    /**
     * 注册自定义事件, 触发一次后即自动移除该事件
     * @param eventName 事件名
     * @param callback 事件回调
     * @param desc 返回 symbol 的描述
     * @returns 唯一标识
     */
    once(eventName: string | symbol, callback: TCallback<S>, desc?: string): symbol;
    /**
     * 判断唯一标识是否存在
     * @param sign 唯一标识
     */
    hasSign(sign: symbol): boolean;
    /**
     * 判断该事件中该回调方法是否存在
     * @param eventName 事件名
     * @param callback 事件回调
     */
    has(eventName: string | symbol, callback: TCallback<S>): boolean;
    /**
     * 判断该事件是否存在
     * @param eventName 事件名
     */
    hasEvent(eventName: string | symbol): boolean;
    /**
     * 触发自定义事件
     * @param eventName 事件名或唯一标识
     * @param args 传递的参数
     */
    emit(eventName: GetMapKeys<(typeof this)['__events__']>, ...args: any[]): boolean;
    /**
     * 取消一个事件回调
     * @param eventName 注册事件时的事件名
     * @param callback 注册事件时的回调函数
     */
    off(...args: [GetMapKeys<(typeof this)['__events__']>, TCallback<S>] | [symbol]): boolean;
}
