import EventBus from '../main.js'

export interface TEventsItem<S> {
	once?: boolean
	callback: (state: S, ...args: any[]) => any
}

export type TEvents<S> = {
	[k: string | symbol]: TEventsItem<S> | TEvents<S>[] | TCallback<S> | TCallback<S>[]
}

export interface TCtx<S> {
	eventBus: EventBus<S>
	on: EventBus<S>['on']
	once: EventBus<S>['once']
	has: EventBus<S>['has']
	hasEvent: EventBus<S>['hasEvent']
	emit: EventBus<S>['emit']
	off: EventBus<S>['off']
	removeEvent: (eventName: string | symbol) => boolean
	state: EventBus<S>['state']
	events: EventBus<S>['__events__']
}

export interface TOptions<S> {
	state?: S
	events?: TEvents<S>
	ctx?: (ctx: TCtx<S>) => void
}

export type TCallback<S> = (state: S, ...args: any[]) => any

// 实例后
export interface TEvent<T> {
	once: boolean
	sign: symbol
	callback: (state: T, ...args: any[]) => any
}

export type TGetEentNames<T> = T extends { events: { name: infer N }[] } ? N : never

// 提取Map键的联合类型
export type GetMapKeys<T> = T extends Map<infer K, any> ? K : never
