import { readFileSync, statSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))
console.log('__dirname:', __dirname)
console.log('cwd:', process.cwd())
const candidate = `${__dirname}/ButtonsPage.vue`
console.log('trying:', candidate)
try {
  const st = statSync(candidate)
  console.log('exists:', true, 'size:', st.size)
} catch (e) {
  console.log('exists:', false, e.code)
}
const content = readFileSync(candidate, 'utf8')
console.log('content length:', content.length)
console.log('--- first 600 chars ---')
console.log(content.slice(0, 600))
