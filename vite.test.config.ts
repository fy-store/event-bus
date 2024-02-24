import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: './test/main.js',
			name: 'EventBus',
			formats: ['es'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			}
		}
	}
})
