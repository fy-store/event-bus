import { readOnly, isType } from 'assist-tools'
import { type TOptions, type TEvent, type TCallback, GetMapKeys } from './types'

const mapHandler = {
	object: <S>(item: TEvent<S>, eventName: string | symbol) => {
		if (!item.callback) {
			throw new Error('"EventItem.callback" does not exist')
		}

		return [
			{
				once: !!item.once,
				sign: Symbol(String(eventName)),
				callback: item.callback
			}
		]
	},

	function: <S>(item: TEvent<S>[], eventName: string | symbol) => {
		return [
			{
				once: false,
				sign: Symbol(String(eventName)),
				callback: item
			}
		]
	},

	array: <S>(item: TEvent<S>[], eventName: string | symbol) => {
		return item.map((el) => {
			if (typeof el === 'function') {
				el = {
					once: false,
					sign: Symbol(String(eventName)),
					callback: el
				}
			}

			if (isType(el) !== 'object') {
				throw new Error('"events" item must be a EventItem')
			}

			if (typeof el.callback !== 'function') {
				throw new Error('"EventItem.callback" must be a function')
			}

			return {
				once: !!el.once,
				sign: Symbol(String(eventName)),
				callback: el.callback
			}
		})
	}
}

export default class EventBus<S> {
	#state: S
	#events = new Map<string | symbol, TEvent<S>[]>()

	constructor(options: TOptions<S> = {}) {
		if (isType(options) !== 'object') {
			throw new TypeError('"options" must be a object')
		}

		const { state = {}, events = {}, ctx } = options
		if (isType(state) !== 'object') {
			throw new TypeError('"state" must be a object')
		}

		if (isType(events) !== 'object') {
			throw new TypeError('"events" must be a object')
		}

		this.#state = state as S

		const handler = (key: string | symbol) => {
			let item = events[key]
			const type = isType(item)
			if (!mapHandler[type as keyof typeof mapHandler]) {
				throw new TypeError('"events" item must be `EventItem`  or `EventItem[]` or `function`')
			}

			// @ts-ignore
			const f = mapHandler[type as unknown as keyof typeof mapHandler].call(this, item, key)
			this.#events.set(key, f)
		}

		Object.keys(events).forEach(handler)
		Object.getOwnPropertySymbols(events).forEach(handler)

		const keys = Object.keys(events)
		keys.forEach((key) => {
			const { callback, once } = events[key]
			if (!this.#events.has(key)) {
				this.#events.set(key, [])
			}
			;(this.#events.get(key) as TEvent<S>[]).push({
				callback,
				once: !!once,
				sign: Symbol(String(key))
			})
		})

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
				events: this.#events
			}
			ctx.call(this, ctxParams)
		}
	}

	get state() {
		return this.#state
	}

	get events() {
		return readOnly(this.#events, 'looseFitting')
	}

	#on(eventName: string | symbol, once: boolean, callback: TCallback<S>): symbol {
		if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
			throw new TypeError('TypeError: "eventName" must be a string or symbol')
		}

		if (typeof callback !== 'function') {
			throw new TypeError('TypeError: "callback" must be a function')
		}

		if (!this.#events.has(eventName)) {
			this.#events.set(eventName, [])
		}

		const sign = Symbol(String(eventName))
		;(this.#events.get(eventName) as TEvent<S>[]).push({
			once,
			sign,
			callback
		})
		return sign
	}

	on(eventName: string | symbol, callback: TCallback<S>): symbol {
		return this.#on(eventName, false, callback)
	}

	once(eventName: string | symbol, callback: TCallback<S>): symbol {
		return this.#on(eventName, true, callback)
	}

	has(eventName: string | symbol, callback: TCallback<S>): boolean {
		if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
			throw new TypeError('TypeError: "eventName" must be a string or symbol')
		}

		if (typeof callback !== 'function') {
			throw new TypeError('TypeError: "callback" must be a function')
		}

		if (!this.#events.has(eventName)) return false
		const eventArr = this.#events.get(eventName) as TEvent<S>[]
		if (eventArr.length === 0) return false
		return !!eventArr.find((item) => item.callback)
	}

	hasEvent(eventName: string | symbol): boolean {
		if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
			throw new TypeError('TypeError: "eventName" must be a string or symbol')
		}

		if (!this.#events.has(eventName)) return false
		return (this.#events.get(eventName) as TEvent<S>[]).length === 0 ? false : true
	}

	emit(eventName: GetMapKeys<typeof this.events>, ...args: any[]) {
		if (!this.#events.has(eventName)) {
			console.error(`Warning: emit => "${String(eventName)}" does not exist`)
			return false
		}

		const eventArr = this.#events.get(eventName) as TEvent<S>[]
		for (let i = 0; i < eventArr.length; i++) {
			const item = eventArr[i]
			item.callback.call(this, this.#state, ...args)
			if (item.once) {
				eventArr.splice(i, i + 1)
				i--
			}
		}
		if (eventArr.length === 0) {
			this.#events.delete(eventName)
		}
		return true
	}

	off(...args: [GetMapKeys<typeof this.events>, TCallback<S>] | [symbol]) {
		if (!args.length) {
			throw new Error(`No parameters passed !`)
		}

		const [eventName, callback] = args

		// 通过 sign 查找并移除
		if (args.length === 1) {
			const entriesEvent = this.#events.entries()
			let result = false
			for (const [name, eventArr] of entriesEvent) {
				const i = eventArr.findIndex((item) => item.sign === eventName)
				if (i !== -1) {
					result = true
					eventArr.splice(i, 1)
					if (eventArr.length === 0) {
						this.#events.delete(name)
					}
					break
				}
			}
			if (!result) {
				console.error(`Warning: off => "${String(eventName)}" does not exist`)
				return false
			}
		} else {
			// 通过相同引用函数删除
			if (!this.#events.has(eventName)) {
				console.error(`Warning: off => "${String(eventName)}" does not exist`)
				return false
			}

			const eventArr = this.#events.get(eventName) as TEvent<S>[]
			const i = eventArr.findIndex((item) => item.callback === callback)
			if (i === -1) {
				console.error(`Warning: off => this "callback" does not exist`)
				return false
			}

			eventArr.splice(i, 1)

			// 处理多个相同函数
			let isNext = true
			while (isNext) {
				const i = eventArr.findIndex((item) => item.callback === callback)
				if (i === -1) {
					isNext = false
					break
				}
				eventArr.splice(i, 1)
			}

			if (eventArr.length === 0) {
				this.#events.delete(eventName)
			}
		}

		return true
	}

	/**
	 * 删除一个事件(且移除该事件所有回调函数)
	 * @param eventName 注册事件时的事件名
	 */
	#removeEvent(eventName: string | symbol): boolean {
		if (!this.#events.has(eventName)) {
			console.error(`Warning: removeEvent => "${String(eventName)}" does not exist`)
			return false
		}
		return this.#events.delete(eventName)
	}
}

const eventBus = new EventBus({
	state: {
		a: 1,
		b: {
			c: 2
		}
	},
	events: {
		abcd: {
			callback(state) {
				console.log(state.b.c)
			}
		}
	}
})

const sign = eventBus.on('b', (state) => {
	state.b.c
})

// eventBus.emit('abcd')

console.log(eventBus.off(sign))
console.log(eventBus)
