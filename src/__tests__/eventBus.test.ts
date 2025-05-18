import { it, expect } from 'vitest'
import EventBus from '../index.js'

it('new EventBus()', () => {
	new EventBus({
		state: { a: 1 },
		eventMap: {
			set1(ctx, value) {
				ctx.state.a = value
			},
			set2(ctx, value) {
				ctx.state.a = value
			}
		},
		ctx(context) {
			expect(context.self.state.a).toBe(1)
			context.setSelf('b', 2)
			// @ts-ignore
			expect(context.self.b).toBe(2)
			context.clear('set2')
			expect(context.eventMap.set2).toBe(undefined)
			context.self.emit('set1', 2)
			expect(context.self.state.a).toBe(2)
			context.clearAll()
			expect(context.eventMap.set1).toBe(undefined)
		}
	})
})

it('on() and emit()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})

	expect(bus.state.a).toBe(1)
	bus.on('setA', (ctx, value) => {
		ctx.state.a = value
	})

	bus.emit('setA', 2)
	expect(bus.state.a).toBe(2)

	const symbol = Symbol()
	bus.on(symbol, (ctx, value) => {
		ctx.state.a = value
	})
	bus.emit(symbol, 3)
	expect(bus.state.a).toBe(3)
})

it('off()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})

	function setA(ctx: any, value: any) {
		ctx.state.a = value
	}
	bus.on('set1', setA)
	bus.off('set1', setA)
	bus.emit('set1', 2)
	expect(bus.state.a).toBe(1)

	const symbol = Symbol()
	bus.on(symbol, setA)
	bus.off(symbol, setA)
	bus.emit(symbol, 2)
	expect(bus.state.a).toBe(1)

	const sign = bus.on('set2', (ctx, value) => {
		ctx.state.a = value
	})

	bus.off('set2', sign)
	bus.emit('set2', 2)
	expect(bus.state.a).toBe(1)
})

it('offBySign()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})

	const sign = bus.on('set2', (ctx, value) => {
		ctx.state.a = value
	})

	bus.offBySign(sign)
	bus.emit('set2', 2)
	expect(bus.state.a).toBe(1)
})

it('once()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})
	bus.once('set', (ctx, value) => {
		ctx.state.a = value
	})
	bus.emit('set', 2)
	expect(bus.state.a).toBe(2)
	bus.emit('set', 3)
	expect(bus.state.a).toBe(2)
})

it('has()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})
	bus.once('set', (ctx, value) => {
		ctx.state.a = value
	})
	expect(bus.has('set')).toBe(true)
	bus.emit('set', 2)
	expect(bus.has('set')).toBe(false)
})

it('hasCallback()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})
	const f1 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	const f2 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	const f3 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	bus.once('set', f1)
	bus.once('set', f2)
	bus.once('set', f3)
	expect(bus.hasCallback('set', f2)).toBe(true)
	bus.emit('set', 2)
	expect(bus.hasCallback('set', f2)).toBe(false)
})

it('hasCallbackBySign()', () => {
	const bus = new EventBus({
		state: { a: 1 }
	})
	const f1 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	const f2 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	const f3 = (ctx: any, value: any) => {
		ctx.state.a = value
	}
	bus.once('set', f1)
	const set2 = bus.once('set', f2)
	bus.once('set', f3)
	expect(bus.hasCallbackBySign(set2)).toBe(true)
	bus.emit('set', 2)
	expect(bus.hasCallbackBySign(set2)).toBe(false)
})

it('emitAwait', async () => {
	const bus = new EventBus({
		state: { a: 1 }
	})
	bus.on('set', async (ctx, value) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				ctx.state.a = value
				resolve(value)
			}, 10)
		})
	})
	await bus.emitAwait('set', 2)
	expect(bus.state.a).toBe(2)
})
