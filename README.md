# 说明

一个发布订阅模块

## 安装

**使用 pnpm**

```sh
pnpm i @yishu/event-bus
```

**使用 yarn**

```sh
yarn add @yishu/event-bus
```

**使用 npm**

```sh
npm i @yishu/event-bus
```

## 使用

```js
import EventBus from '@yishu/event-bus'

const eventBus = new EventBus({
	state: {
		a: 1,
		b: 2,
		c: {
			d: 3
		}
	}
})

/** 注册事件 */
eventBus.on('e', (ctx, ...args) => {
	console.log('e', ctx, ...args)
})

/** 触发事件并传递参数 */
eventBus.emit('e', 1, 'a', { name: 'test' })

/** 移除事件1 */
const f1 = () => {}
eventBus.on('f1', f1) // 注册
eventBus.off('f1', f1) // 移除

/**
 * 移除事件2
 * - 使用标识符移除
 */
const f2 = eventBus.on('f2', () => {}) // 注册并接收返回值
eventBus.off(f2) // 通过标识符移除
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
    -   eventMap 事件配置, 接收一个对象 [可选]
    -   ctx 实例上下文 hook, 接收一个函数 [可选]

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
		/** 简写注册事件 */
		a(ctx) {},

		/** 数组形式注册多个事件 */
		b: [(ctx) => {}, (ctx) => {}],

		/** 数组对象形式完整配置注册多个事件 */
		c: [
			{
				fn: (ctx) => {},
				once: true, // 是否只执行一次
				sign: Symbol('自定义标识符')
			}
		]
	},

	/** 实例上下文 hook */
	ctx(ctx) {
		// ctx.clear('a') // 清除指定事件
		// ctx.clearAll() // 清除指定事件
		// ctx.state // 状态对象
		// ctx.eventMap // 解析后的事件对象
		// ctx.self // 当前实例
		// ctx.setSelf('d', 1) // 设置实例属性(避免ts警告)
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

symbol 唯一标识, 后续可用该标识移除回调

### once

注册一个一次性事件, 当事件触发一次后将被移除

**语法**

```
eventBus.once(eventName, callback)
```

-   eventName 事件名称, 支持字符串和 symbol

-   callback 事件回调函数

**返回值**

symbol 唯一标识, 后续可用该标识移除回调

### emit

触发指定事件

**语法**

```
eventBus.emit(eventName [,arg1, arg2, arg3, ...argN])
```

-   eventName 需要触发的事件的名称
-   arg 需要传递的事件参数

**返回值**

this

### off

移除一个事件中的回调

**语法**

```
eventBus.off(eventName, ref)
```

-   eventName 需要移除的事件的名称
-   ref 事件回调引用(函数或 symbol)

**返回值**

this

### offBySign

移除一个事件中的回调

**语法**

```
eventBus.offBySign(ref)
```

-   ref 事件回调唯一标识(不允许函数, 函数复用更为普遍)

**返回值**

this

### has

判断事件是否存在

**语法**

```
eventBus.has(eventName)
```

-   eventName 事件的名称

**返回值**

boolean

### hasCallback

判断事件中的回调是否存在

**语法**

```
eventBus.hasCallback(eventName, ref)
```

-   eventName 事件的名称
-   ref 事件回调引用(函数或 symbol)

**返回值**

boolean

### hasCallbackBySign

判断事件中的回调是否存在

**语法**

```
eventBus.hasCallbackBySign(sign)
```

-   sign 回调唯一标识

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

    -   ctx.clear(eventName) // 清除指定事件
    -   ctx.clearAll() // 清除指定事件
    -   ctx.state // 状态对象
    -   ctx.eventMap // 解析后的事件对象
    -   ctx.self // 当前实例
    -   ctx.setSelf(prop, value) // 设置实例属性(避免 ts 警告)

## ts 类型支持

导入类型

```ts
import type { Self } from '@yishu/event-bus'
```

使用

```ts
type A = Self
```

自定义状态和事件类型

示例 1

```ts
import type { DefindEventMap } from '@yishu/event-bus'

interface State {
	a?: number
	b?: string
	c?: boolean
}

type Keys = 'changeA' | 'changeB' | 'changeC'

const eventBus = new EventBus<State, DefindEventMap<State, Keys>>()
eventBus.state.a // 类型推导
eventBus.emit('changeA') // 类型推导
```

示例 2

```ts
import type { DefindEventMap } from '@yishu/event-bus'

interface State {
	a?: number
	b?: string
}

type Keys = 'setA' | 'setB'

class Test extends EventBus<State, DefindEventMap<State, Keys>> {
	constructor() {
		super()
	}
}

const test = new Test()
test.on('setA', (ctx) => {
	console.log(ctx)
})
test.emit('setA')
```
