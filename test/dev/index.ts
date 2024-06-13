import EventBus from '../../src/main'

const eventBus = new EventBus({
	state: {
		test1: 'abc',
		test2: 'def',
		other: {
			name: '哈哈',
			age: 20
		}
	},

	events: {
		/** 配置对象形式注册事件 */
		a: {
			callback(state, ...args) {
				console.log('a', state, ...args)
			},
			/** 是否仅触发一次(触发一次后即移除), 默认为 false */
			once: true
		},

		/** 配置对象形式注册多个事件 */
		b: [
			{
				callback(state, ...args) {
					console.log('b1', state, ...args)
				}
			},
			{
				callback(state, ...args) {
					console.log('b2', state, ...args)
				}
			}
		],

		/** 函数形式注册事件(配置对象形式的简写) */
		c(state, ...args) {
			console.log('c', state, ...args)
		},

		/** 函数形式注册多个事件(配置对象形式的简写) */
		d: [
			(state, ...args) => {
				console.log('d1', state, ...args)
			},
			(state, ...args) => {
				console.log('d2', state, ...args)
			}
		]
	},

	ctx(ctx) {
		console.log('ctx', ctx)
	}
})

/** 输出 state */
console.log('state', eventBus.state)

/** 触发事件并传参 */
eventBus.emit('a', '1', '2', '3')

/** 注册事件 */
eventBus.on('e', (state, ...args) => {
	console.log('e', state, ...args)
})

/** 注册仅运行一次的事件(运行一次后即移除) */
eventBus.once('g', (state, ...args) => {
	console.log('g', state, ...args)
})

/** 判断该事件中指定回调方法是否存在 */
const h = (state, ...args) => {
	console.log('h', state, ...args)
}
eventBus.once('h', h)

console.log(eventBus.has('h', h)) // true

eventBus.emit('h')
console.log(eventBus.has('h', h)) // false

/** 判断是否存在该事件 */
console.log(eventBus.hasEvent('b')) // true
console.log(eventBus.hasEvent('h')) // false

/** 移除指定事件中的回调方法 */
const i = (state, ...args) => {
	console.log('i', state, ...args)
}
eventBus.once('i', i)
console.log(eventBus.has('i', i)) // true
eventBus.off('i', i)
console.log(eventBus.has('i', i)) // false
