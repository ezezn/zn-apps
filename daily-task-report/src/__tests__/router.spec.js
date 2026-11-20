import { describe, it, expect } from 'vitest'
import { routes } from '../router/index.js'

describe('Daily Task Report routes', () => {
  it('exposes the home, tasks, updates, settings and about screens', () => {
    expect(routes.map((route) => route.path)).toEqual(['/', '/tasks', '/updates', '/settings', '/about', '/:pathMatch(.*)*'])
  })

  it('starts on the home page', () => {
    expect(routes[0].name).toBe('home')
    expect(routes[0].redirect).toBeUndefined()
    expect(routes.at(-1).redirect).toBe('/')
  })

  it('names and resolves every screen component', () => {
    const named = routes.filter((route) => route.name)
    expect(named.map((route) => route.name)).toEqual(['home', 'tasks', 'updates', 'settings', 'about'])
    named.forEach((route) => expect(route.component).toBeTruthy())
  })
})
