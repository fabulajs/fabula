import store from '../store'
import main from '../components/main'
import elementsUI from '../elements'

export default class Form {
  constructor(options) {
    const { lesta, root, elements, onRequest, onResponse } = options
    const { createApp, deliver, replicate } = lesta
    root.classList.add('lstUI')
    this.element = {}
    this.resetStore = () => {}
    this.app = createApp({
      root,
      stores: { form: store(deliver, replicate, this, onRequest, onResponse) },
      plugins: {
        ...lesta,
        elements: { ...elementsUI, ...elements },
        bus: { entry: {}, local: {} },
        execute({_values, path, value, direction}) {
          const command = 'return ' + direction
          const pathClone = [...path]
          let index = undefined
          let length = undefined
          if (typeof pathClone.at(-1) === 'number') {
            index = pathClone.pop()
            pathClone.push('length')
            length = deliver(_values, pathClone)
          }
          const currentIndex = {}
          path.forEach((p, index) => typeof p === 'number' ? currentIndex[path[index - 1]] = p : false)
          const fn = new Function('_values', 'value', 'index', 'length', 'currentIndex', command)
          return fn(_values, value, index, length, currentIndex)
        }
      }
    })
  }
  async create(target, options = {}) {
    let entry = {}
    if (this.app.root.unmount) await this.unmount()
    if (typeof target === 'string') {
      const res = await fetch(target, options)
      entry = await res.json()
    } else entry = target
    this.app.plugins.bus.entry = entry
    this.app.plugins.bus.local = entry.local
    await this.mount()
  }
  async mount() {
    await this.app.mount(main)
  }
  async unmount() {
    await this.app.unmount()
    this.resetStore()
  }
}
