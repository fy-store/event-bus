import EventBus from '../../src/index.js'
import type { DefindEventMap } from '../../src/index.js'

interface State {
	a?: number
	b?: string
}

type Keys = 'setA' | 'setB'

const test = new EventBus<State, DefindEventMap<State, Keys>>()

test.on('setA', async (ctx) => {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(1)
		}, 2000)
	})
	return 1
})
test.on('setA', (ctx) => {
	throw new Error('error')
})

const result = await test.emitAwait('setA')

console.log(result)
