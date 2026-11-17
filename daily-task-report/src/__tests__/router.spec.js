import { describe, it, expect } from 'vitest'
import { routes } from '../router/index.js'

describe('Daily Task Report routes', () => {
  it('exposes the tasks, updates, settings and about screens', () => {
    expect(routes.map((route) => route.path)).toEqual(['/', '/tasks', '/updates', '/settings', '/about', '/:pathMatch(.*)*'])
  })

  it('starts on the tasks list', () => {
    expect(routes[0].redirect).toBe('/tasks')
    expect(routes.at(-1).redirect).toBe('/tasks')
  })

  it('names and resolves every screen component', () => {
    const named = routes.filter((route) => route.name)
    expect(named.map((route) => route.name)).toEqual(['tasks', 'updates', 'settings', 'about'])
    named.forEach((route) => expect(route.component).toBeTruthy())
  })
})
