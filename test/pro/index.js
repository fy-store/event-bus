import EventBus from '../../src/main'

const eventBus = new EventBus({
	state: {
		a: 123,
		b: 456
	},

	events: {
		sayHello(state) {
			console.log('hello, ', state.a, state.b)
		}
	}
})

console.log(eventBus.emit('sayHello'))

const bb = eventBus.on('bb', (state) => {
	console.log('bb', state.b)
})

console.log(bb)

console.log('abc'.toString())
console.log(Symbol('bb').toString())
