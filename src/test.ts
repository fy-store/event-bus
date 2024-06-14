interface TEvents<T> {
	name: string
	callback: (state: T, ...args: any[]) => any
}

interface Options<T, U extends TEvents<T>[]> {
	state: T
	events: U
}

type EventNames<T> = T extends { events: { name: infer N }[] } ? N : never
type GetState<T> = T extends { state: infer N } ? N : never

class Test<T, U extends TEvents<T>[]> {
	#state: T
	events: U

	get state() {
		return this.#state
	}

	constructor(options: Options<T, U>) {
		this.#state = options.state
		this.events = options.events
	}

	emit<T extends EventNames<{ events: U }>>(_name: T, ..._args: any[]): void {}

	on(_name: string, _callback: (state: GetState<Options<T, U>>, ...args: any[]) => any): void {}
}

const test = new Test({
	state: {
		a: 1,
		b: 2,
		c: {
			d: 4
		}
	},
	events: [
		{
			name: 'abc' as const,
			callback: (state) => {
				state.c.d
				console.log(state.c)
			}
		}
	]
})

test.on('hh', (state) => {
	state.c
})

test.emit('abc') // 类型推断失败, 都是 never , 希望推断出创建实例时传入的 events 每一项的 name
