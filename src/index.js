import './components/UI/general.css'
import './styles.css'
import main from './components/main'

export default {
    app: {},
    method: {},
    create: function ({ createApp, deliver, replicate }, root) {
        const rootContainer = document.querySelector(root)
        rootContainer.classList.add('lstUI')
        const fabula = this
        this.app = createApp({
            root: rootContainer,
            stores: {
                form: {
                    params: {
                        errors: {}
                    },
                    proxies: {
                        _values: {},
                        error: true
                    },
                    methods: {
                        get({path}) {
                            deliver(this.proxy._values, path)
                        },
                        set({path, value}) {
                            deliver(this.proxy._values, path, value)
                        },
                        add({path, value}) {
                            const length = deliver(this.proxy._values, path)?.length || 0
                            deliver(this.proxy._values, [...path, length], value)
                            deliver(this.proxy._values, [...path, 'length'], length + 1)
                        },
                        remove({path}) {
                            const length = deliver(this.proxy._values, path)?.length || 0
                            deliver(this.proxy._values, [...path, 'length'], length - 1)
                        },
                        error({key, value}) {
                            this.param.errors[key] = value
                            this.proxy.error = Object.values(this.param.errors).includes(true)
                        },
                        async submit() {
                            const { url, method, headers } = this.bus.entry.server
                            try {
                                const res = await fetch(url, {
                                    method,
                                    headers,
                                    body: JSON.stringify(this.proxy._values)
                                })
                                const obj = await res.json()
                                return obj.message || this.bus.local.sentMessage
                            } catch (err) {
                                return this.bus.local.errorMessage
                            }
                        },
                        async clear() {
                            await this.destroy()
                            this.param.error = {}
                            this.proxy._values = {}
                            await this.update()
                        }
                        
                    },
                    created() {
                        Object.assign(fabula.method, this.method)
                    }
                }
            },
            plugins: {
                ...lesta,
                elements: {
                    input: () => import('./components/UI/input'),
                    button: () => import('./components/UI/button'),
                    buttons: () => import('./components/UI/buttons'),
                    nest: () => import('./components/UI/nest')
                },
                bus: {
                    entry: {},
                    local: {}
                },
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
    },
    init: async function (entry) {
        this.app.plugins.bus.entry = entry
        this.app.plugins.bus.local = entry.local
        this.app.plugins.destroy = async () => this.app.root.unmount && await this.app.unmount()
        this.app.plugins.update = async () => await this.app.mount(main)
        this.app.plugins.update()
    },
    destroy: async function () {
        await this.app.unmount()
    }
}
