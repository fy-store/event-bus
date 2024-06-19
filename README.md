# 说明

一个发布订阅模块

事实上各大框架生态中已经提供了多种通信方式

本模块只适用于通信方式不友好的程序, 比如: 原生微信小程序

对于无法支持 npm 包的可以下载该包后手动复制到工程中, 记得复制类型声明文件, 这能够给你带来友好的类型提示

## 安装

**使用 pnpm**

```cmd
pnpm i @yishu/event-bus
```

**使用 yarn**

```cmd
yarn add @yishu/event-bus
```

**使用 npm**

```cmd
npm i @yishu/event-bus
```

## 使用

```js
import EventBus from '@yishu/event-bus'

const eventBus = new EventBus({
	// 推荐需要使用的数据提前在 state 中定义好, 这样在后续的使用中能够获得友好的类型提示
	state: {
		a: 1,
		b: 2,
		c: {
			d: 3
		}
	}
})

/** 注册事件 */
eventBus.on('e', (state, ...args) => {
	console.log('e', state, ...args)
})

/** 触发事件并传递参数 */
eventBus.emit('e', 1, 'a', { name: 'test' })

/** 移除事件1 */
const f1 = () => {}
eventBus.on('f1', f1) // 注册
eventBus.off('f1', f1) // 移除

/**
 * 移除事件2
 * - 你希望使用更优雅的方式移除, 亦或者你不方便保存事件函数
 */
const f2 = eventBus.on('f2', () => {}) // 注册并接收返回值
eventBus.off(f2) // 通过返回值移除
```

如果你想使用 CommonJS 模块化规范, 那么你可以使用以下方式导入

```js
const EventBus = require('@yishu/event-bus/dist/main.cjs.js')
const eventBus = new EventBus()
```

## EventBus

**语法**

```
const eventBus = new EventBus([options])
```

-   options 配置对象 [可选]
    -   state 状态数据, 接收一个对象 [可选]
    -   events 事件, 接收一个对象 [可选]
    -   ctx 获取上下文对象回调函数, 接收一个函数 [可选]

事件中的函数 this 默认绑定为实例对象, 如果你希望使用 this 来获取实例, 请使用普通函数, 而非箭头函数

```js
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
			/** 是否仅触发一次(触发一次后即移除), 默认为 false [可选] */
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

	/** 获取实例上下文 */
	ctx(ctx) {
		// eventBus 实例对象
		// state 实例的状态数据
		// events 实例的事件数据 [仅在当前上下文对象中可以获取]
		// on 实例的 on 方法
		// once 实例的 once 方法
		// has 实例的 has 方法
		// hasSign 实例的 hasSign 方法
		// hasEvent 实例的 hasEvent 方法
		// emit 实例的 emit 方法
		// off 实例的 off 方法
		// removeEvent 移除某个事件方法 [仅在当前上下文对象中可以获取]

		// 上下文对象中的函数 this 已被绑定, 支持解构
		console.log('ctx', ctx)
	}
})
```

## 实例属性

### state

事件状态数据

```
eventBus.state
```

## 原型方法

### on

注册一个事件

**语法**

```
eventBus.on(eventName, callback)
```

-   eventName 事件名称, 支持字符串和 symbol
-   callback 事件回调函数

**返回值**

symbol 唯一标识, 后续可用该标识触发/移除函数

### once

注册一个一次性事件, 当事件触发一次后将被移除

**语法**

```
eventBus.once(eventName, callback)
```

-   eventName 事件名称, 支持字符串和 symbol

-   callback 事件回调函数

**返回值**

symbol 唯一标识, 后续可用该标识触发/移除函数

### emit

触发指定事件

**语法**

```
eventBus.emit(eventName [,arg1, arg2, arg3, ...argN])
```

-   eventName 需要触发的事件的名称或唯一标识
-   arg 需要传递的事件参数

**返回值**

boolean

### off

移除一个事件中的回调

**语法**

```
eventBus.off(eventName, callback)
```

-   eventName 需要移除的事件的名称或唯一标识
-   callback 需要移除的事件的回调函数

**返回值**

boolean

### has

判断指定事件中的回调函数是否存在

**语法**

```
eventBus.has(eventName, callback)
```

-   eventName 需要判断是否存在的事件的名称
-   callback 需要判断是否存在的事件的回调函数

**返回值**

boolean

### hasSign

判断唯一标识是否存在

**语法**

```
eventBus.hasSign(sign)
```

-   sign 需要判断是否存在的唯一标识

**返回值**

boolean

### hasEvent

判断事件是否存在

**语法**

```
eventBus.hasEvent(eventName)
```

-   eventName 需要判断是否存在的事件名称

**返回值**

boolean

## 上下文对象

通过实例时传递的 ctx 配置函数获得

```js
const eventBus = new EventBus({
	ctx(ctx) {
		// 上下文对象中的函数 this 已被绑定, 支持解构
		console.log(ctx)
	}
})
```

-   ctx 上下文对象

    -   eventBus 实例对象

    -   state 实例的状态数据

    -   events 实例的事件数据 [仅在当前上下文对象中可以获取]

    -   on 实例的 on 方法

    -   once 实例的 once 方法

    -   has 实例的 has 方法

    -   hasSign 实例的 hasSign 方法

    -   hasEvent 实例的 hasEvent 方法

    -   emit 实例的 emit 方法

    -   off 实例的 off 方法

    -   removeEvent 移除某个事件方法 [仅在当前上下文对象中可以获取]

        -   语法 `ctx.removeEvent(eventName)`

            -   eventName 需要删除的事件的名称
            -   删除事件其下所有回调函数都将被移除

        -   返回值 boolean
