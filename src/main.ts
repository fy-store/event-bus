import { readOnly, isType } from 'assist-tools'
import { type TOptions, type TEvent, type TCallback, GetMapKeys } from './types/index.js'

const mapHandler = {
	object: <S>(item: TEvent<S>, eventName: string | symbol) => {
		if (!item.callback) {
			throw new Error('"EventItem.callback" does not exist')
		}

		return [
			{
				once: !!item.once,
				sign: Symbol(eventName.toString()),
				callback: item.callback
			}
		]
	},

	function: <S>(item: TEvent<S>[], eventName: string | symbol) => {
		return [
			{
				once: false,
				sign: Symbol(eventName.toString()),
				callback: item
			}
		]
	},

	array: <S>(item: TEvent<S>[], eventName: string | symbol) => {
		return item.map((el) => {
			if (typeof el === 'function') {
				el = {
					once: false,
					sign: Symbol(eventName.toString()),
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
				sign: Symbol(eventName.toString()),
				callback: el.callback
			}
		})
	}
}

/**
 * 发布订阅
 * - 详细使用方式请查阅文档
 */
export default class EventBus<S> {
	#state: S
	#events = new Map<string | symbol, TEvent<S>[]>()

	/**
	 * 发布订阅
	 * - 详细使用方式请查阅文档
	 * @param options 配置对象
	 */
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

		if (ctx) {
			const ctxParams = {
				eventBus: this,
				on: this.on.bind(this),
				once: this.once.bind(this),
				has: this.has.bind(this),
				hasSign: this.hasSign.bind(this),
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

	/**
	 * 状态
	 */
	get state() {
		return this.#state
	}

	/**
	 * 解析后的事件对象, 此处仅用于提供类型推导(不允许操作)
	 */
	get __events__() {
		return readOnly(this.#events, 'strict')
	}

	#on(eventName: string | symbol, once: boolean, callback: TCallback<S>, desc: string = ''): symbol {
		if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
			throw new TypeError('TypeError: "eventName" must be a string or symbol')
		}

		if (typeof callback !== 'function') {
			throw new TypeError('TypeError: "callback" must be a function')
		}

		if (typeof desc !== 'string') {
			throw new TypeError('TypeError: "desc" must be a string')
		}

		if (!this.#events.has(eventName)) {
			this.#events.set(eventName, [])
		}

		const sign = Symbol(desc || eventName.toString())
		;(this.#events.get(eventName) as TEvent<S>[]).push({
			once,
			sign,
			callback
		})
		return sign
	}

	/**
	 * 注册自定义事件
	 * @param eventName 事件名
	 * @param callback 事件回调
	 * @param desc 返回 symbol 的描述
	 * @returns 唯一标识
	 */
	on(eventName: string | symbol, callback: TCallback<S>, desc?: string): symbol {
		return this.#on(eventName, false, callback, desc)
	}

	/**
	 * 注册自定义事件, 触发一次后即自动移除该事件
	 * @param eventName 事件名
	 * @param callback 事件回调
	 * @param desc 返回 symbol 的描述
	 * @returns 唯一标识
	 */
	once(eventName: string | symbol, callback: TCallback<S>, desc?: string): symbol {
		return this.#on(eventName, true, callback, desc)
	}

	/**
	 * 判断唯一标识是否存在
	 * @param sign 唯一标识
	 */
	hasSign(sign: symbol) {
		const entriesEvent = this.#events.entries()
		for (const [, eventArr] of entriesEvent) {
			const i = eventArr.findIndex((item) => item.sign === sign)
			if (i !== -1) {
				return true
			}
		}
		console.error(`Warning: off => "${String(sign)}" does not exist`)
		return false
	}

	/**
	 * 判断该事件中该回调方法是否存在
	 * @param eventName 事件名
	 * @param callback 事件回调
	 */
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

	/**
	 * 判断该事件是否存在
	 * @param eventName 事件名
	 */
	hasEvent(eventName: string | symbol): boolean {
		if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
			throw new TypeError('TypeError: "eventName" must be a string or symbol')
		}

		if (!this.#events.has(eventName)) return false
		return (this.#events.get(eventName) as TEvent<S>[]).length === 0 ? false : true
	}

	/**
	 * 触发自定义事件
	 * @param eventName 事件名或唯一标识
	 * @param args 传递的参数
	 */
	emit(eventName: GetMapKeys<(typeof this)['__events__']>, ...args: any[]) {
		if (!this.#events.has(eventName)) {
			// 事件名不存在, 使用 sign 查找
			const entriesEvent = this.#events.entries()
			for (const [name, eventArr] of entriesEvent) {
				const i = eventArr.findIndex((item) => item.sign === eventName)
				if (i !== -1) {
					try {
						eventArr[i].callback.call(this, this.#state, ...args)
					} catch (error) {
						console.error(error)
					}
					if (eventArr[i].once) {
						eventArr.splice(i, 1)
						if (eventArr.length === 0) {
							this.#events.delete(name)
						}
					}
					return true
				}
			}

			console.error(`Warning: emit => "${String(eventName)}" does not exist`)
			return false
		}

		const eventArr = this.#events.get(eventName) as TEvent<S>[]
		for (let i = 0; i < eventArr.length; i++) {
			const item = eventArr[i]
			try {
				item.callback.call(this, this.#state, ...args)
			} catch (error) {
				console.error(error)
			}
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

	/**
	 * 取消一个事件回调
	 * - 当传递一个参数时 eventName 作为唯一标识
	 * - 当传递两个参数时 eventName 作为事件名
	 * @param eventName 注册事件时的事件名或唯一标识
	 * @param callback 注册事件时的回调函数
	 */
	off(...args: [GetMapKeys<(typeof this)['__events__']>, TCallback<S>] | [symbol]) {
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
