/// <reference types="vitest" />
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		target: 'es2015',
		lib: {
			entry: process.env.VITE_APP_PATH as string,
			name: 'EventBus',
			formats: ['es', 'cjs'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			}
		}
	},

	plugins: [
		dts({
			afterBuild(emittedFiles) {
				const rootPath = path.resolve()
				const reg = /\\/g
				const p = path.join(rootPath, '/dist/main.d.ts').replace(reg, '/')
				const content = emittedFiles.get(p) as string
				fs.writeFileSync(path.join(rootPath, '/dist/main.es.d.ts'), content)
				fs.writeFileSync(path.join(rootPath, '/dist/main.cjs.d.ts'), content)
			}
		})
	]
})
