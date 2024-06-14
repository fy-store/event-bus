export const mapHandler = {
	object: <T>(item: EventItem<T>) => {
		if (!item.callback) {
			throw new Error('"EventItem.callback" does not exist')
		}

		return [
			{
				once: !!item.once,
				callback: item.callback
			}
		]
	},

	function: <T>(item: Callback<T>) => {
		return [
			{
				once: false,
				callback: item
			}
		]
	},

	array: <T>(item: EventItem<T>[]) => {
		return item.map((el) => {
			if (typeof el === 'function') {
				el = {
					once: false,
					sign: Symbol(),
					callback: el
				}
			}

			if (isType(el) !== 'object') {
				throw new Error('"events" item must be a EventItem')
			}

			if (typeof el.callback !== 'function') {
				throw new Error('"EventItem.callback" must be a function')
			}

			return {
				once: !!el.once,
				callback: el.callback
			}
		})
	}
}