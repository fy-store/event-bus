import EventBus from '../../src/index.js'
import type { DefindEventMap } from '../../src/index.js'

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
