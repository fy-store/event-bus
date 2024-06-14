import EventBus from '../../src/index'

const eventBus = new EventBus({
    state: {
        b: 456
    }
})
console.log(eventBus)

eventBus.on('a', (state) => {
	state.b = '123'
	console.log(state)
})
eventBus.on('a', (state) => {
	console.log(state.b)
})

eventBus.emit('a')
