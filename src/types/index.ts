import type EventBus from '../index.js'

/** 配置选项 */
export interface Options<S extends State, E extends EventMapOption<S, EventBus<S, E>>> {
	/** 状态对象 */
	state?: S
	/** 事件配置对象, key 为事件名, 支持 symbol */
	eventMap?: E
	/** 实例上下文, 通过该钩子可以最大限度操作 EventBus 的实例 */
	ctx?: (this: EventBus<S, E>, ctx: EventBusCtx<S, E, EventMap<S, EventBus<S, E>>>) => void
}

export interface EventBusCtx<
	S extends State,
	E extends EventMapOption<S, EventBus<S, E>>,
	EM extends EventMap<S, EventBus<S, E>>
> {
	/** 状态对象 */
	state: S
	/** 解析后的事件对象 */
	eventMap: EM
	/** 实例引用 */
	self: EventBus<S, E>
	/** 设置实例属性 */
	setSelf(key: string | symbol, value: any): any
	/**
	 * 清除一个事件
	 * @param eventName 事件名称
	 */
	clear(eventName: keyof E): void
	/**
	 * 清除一个事件
	 * @param eventName 事件名称
	 */
	clear(eventName: string | symbol): void
	/**
	 * 清除所有事件
	 */
	clearAll(): void
}

export type State = Record<string | symbol, any>

/** 上下文 */
export interface Ctx<S, Self> {
	/** 状态 */
	state: S
	/** 实例 */
	self: Self
}

/** 事件回调函数 */
export interface Callback<S, Self> {
	(this: Self, ctx: Ctx<S, Self>, ...args: any[]): void
}

/** 事件回调函数配置选项 */
export interface CallbackOptions<S, Self> {
	/** 是否只执行一次 */
	once?: boolean
	/** 自定义标识 */
	sign?: symbol
	/** 事件回调 */
	fn: Callback<S, Self>
}

/** 事件配置对象, key 为事件名, 支持 symbol */
export interface EventMapOption<S extends State, Self> {
	[k: string | symbol]: Callback<S, Self> | Callback<S, Self>[] | CallbackOptions<S, Self>[]
}

/** 注册事件配置选项 */
export interface OnOptions {
	/** 自定义标识 */
	sign?: symbol
}

export interface CallbackInfo<S, Self> {
	once: boolean
	sign: symbol
	fn: Callback<S, Self>
}

export interface EventMap<S, Self> {
	[k: string | symbol]: CallbackInfo<S, Self>[]
}

// 工具类型
type _DinfindEventMap<S extends State, Self, Keys extends string | symbol> = Partial<
	Record<Keys, Callback<S, Self> | Callback<S, Self>[] | CallbackOptions<S, Self>[]>
>

/** 自定义 eventMap */
export type DefindEventMap<S extends State, Keys extends string | symbol> = _DinfindEventMap<S, EventBus<S, any>, Keys>

// 工具类型
export type Self<S extends State, E extends EventMapOption<S, EventBus<S, E>>> = EventBus<S, E>
