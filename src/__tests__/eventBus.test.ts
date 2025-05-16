import { describe, it, expect } from 'vitest'
import EventBus from '../index.js'

describe('EventBus', () => {
	it('on', () => {
		const bus = new EventBus({
			state: {
				a: 1
			},
			eventMap: {
				test: (ctx, ...args) => {
					expect(ctx.state.a).toBe(1)
					expect(args).toEqual([1, 2, 3])
					ctx.state.a = 2
				}
			}
		})
		expect(bus.emit('test', 1, 2, 3)).toBe(bus)
		expect(bus.state.a).toBe(2)
	})

	it('emit once', () => {
		const bus = new EventBus()
		bus.once('test', (ctx, a: number) => {
			ctx.state.a = a
		})
		expect(bus.emit('test', 1)).toBe(bus)
		expect(bus.emit('test', 2)).toBe(bus)
		expect(bus.state.a).toBe(1)
	})

	it('off() and has() and hasCallback() and hasCallbackBySign() and offBySign()', () => {
		const bus = new EventBus()
		const callback = (_ctx: any, _a: number) => {}
		let sign = bus.on('test', callback)
		expect(bus.has('test')).toBe(true)
		expect(bus.hasCallback('test', callback)).toBe(true)
		expect(bus.hasCallbackBySign(sign)).toBe(true)
		expect(bus.off('test', callback)).toBe(bus)
		expect(bus.has('test')).toBe(false)
		sign = bus.on('test', callback)
		expect(bus.offBySign(sign)).toBe(bus)
		expect(bus.has('test')).toBe(false)
	})
})
