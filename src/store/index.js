export default function store(deliver, replicate, form, onRequest, onResponse) {
  return {
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
          let body = onRequest ? await onRequest(replicate(this.proxy._values)) : JSON.stringify(this.proxy._values)
          const res = await fetch(url, {
            method,
            headers,
            body
          })
          onResponse ? await onResponse(res) : this.bus.local.sentMessage
        } catch (err) {
          return this.bus.local.errorMessage
        }
      },
      async clear() {
        await form.unmount()
        await form.mount()
      }
    },
    created() {
      const { get, set, add, remove } = this.method
      Object.assign(form.element, { get, set, add, remove })
      form.resetStore = () => {
        this.param.error = {}
        this.proxy._values = {}
        this.proxy.error = true
      }
    }
  }
}