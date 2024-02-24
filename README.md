# 说明

一个事件总线库



## 安装

**使用 pnpm**

```cmd
pnpm i event-bus-js
```



**使用 yarn**

```cmd
yarn add event-bus-js
```



**使用 npm**

```cmd
npm i event-bus-js
```





## 使用

```js
// 在构建工具中
import EventBus from 'event-bus-js'
// 如果你的构建工具版本较低, 无法处理 class 的私有属性
// 你可以使用以下方式导入降级后的包
// import EventBus from 'event-bus-js/dist/main.es.js'

const eventBus = new EventBus()
/** 注册事件 */
eventBus.on('e', (state, ...args) => {
	console.log('e', state, ...args)
})
/** 触发事件并传递参数 */
eventBus.emit('e', 1, 'a', {name: 'test'})
```





## EventBus

**语法**

```
const eventBus = new EventBus([options])
```

- options 配置对象 [可选]
  - state 状态数据, 接收一个对象 [可选]
  - events 事件, 接收一个对象 [可选]
  - ctx 获取上下文对象回调函数, 接收一个函数 [可选]

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

- eventName 事件名称, 支持字符串和symbol
- callback 事件回调函数



**返回值**

boolean





### once

注册一个一次性事件, 当事件触发一次后将被移除



**语法**

```
eventBus.once(eventName, callback)
```

- eventName 事件名称, 支持字符串和symbol

- callback 事件回调函数

  

**返回值**

boolean





### emit

触发指定事件



**语法**

```
eventBus.once(eventName [,arg1, arg2, arg3, ...argN])
```

- eventName 需要触发的事件的名称
- arg 需要传递的事件参数



**返回值**

boolean





### off

移除一个事件中的回调



**语法**

```
eventBus.off(eventName, callback)
```

- eventName 需要移除的事件的名称
- callback 需要移除的事件的回调函数



**返回值**

boolean





### has

判断指定事件中的回调函数是否存在



**语法**

```
eventBus.off(eventName, callback)
```

- eventName 需要判断是否存在的事件的名称
- callback 需要判断是否存在的事件的回调函数



**返回值**

boolean





### hasEvent

判断事件是否存在



**语法**

```
eventBus.hasEvent(eventName)
```

- eventName 需要判断是否存在的事件名称



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

- ctx 上下文对象

  - eventBus 实例对象

  - state 实例的状态数据

  - events 实例的事件数据 [仅在当前上下文对象中可以获取]

  - on 实例的 on 方法

  - once 实例的 once 方法

  - has 实例的 has 方法

  - hasEvent 实例的 hasEvent 方法

  - emit 实例的 emit 方法

  - off 实例的 off 方法

  - removeEvent 移除某个事件方法 [仅在当前上下文对象中可以获取]

    - 语法 `ctx.removeEvent(eventName)`

      - eventName 需要删除的事件的名称
      - 删除事件其下所有回调函数都将被移除

    - 返回值 boolean

  


