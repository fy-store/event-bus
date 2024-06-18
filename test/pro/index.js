import EventBus from '../../dist/main.es.js'

const eventBus = new EventBus({
	state: {
		a: 123,
		b: 456
	},

	events: {
		sayHello: {
			callback(state) {
				console.log('hello, ', state.a, state.b)
			},
			once: true
		}
	}
})

eventBus.on('bb', function (state) {
	console.log(this.state === state)
})

eventBus.emit('bb')
