import { createForm, jsonToFormData } from '../src'
const form = createForm({
  lesta,
  root: document.querySelector('#root'),
  elements: {
    custom: () => {}
  },
  async onRequest(data) {
    console.log(data)
    // for (const pair of jsonToFormData(data).entries()) {
    //   console.log(pair.at(0)+ ' - ' + pair.at(1))
    // }
    // return jsonToFormData(data) // default JSON.stringify(data)
  },
  async onResponse(res) {
    console.log(res)
    // await res.json()
    window.location.href = res.data.url
  }
})
// const { get, set, add, remove } = form.element
form.mount('/form.json') // form.mount('/form.json', options) || form.mount(jsonfile)

// form.unmount()