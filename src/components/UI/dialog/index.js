import './index.css'

export default {
  template: `
  <dialog class="lstDialog l-scrollbar">
    <div class="lstClose"></div>
    <div section="content"></div>
  </dialog>`,
  props: {
    proxies: {
      maximize: {},
      opened: {},
    },
    methods: {
      onclose: {}
    }
  },
  handlers: {
    opened(v) {
        v ? this.node.lstDialog.showModal() : this.node.lstDialog.close()
    }
  },
  nodes() {
    return {
      lstDialog: {
        _class: {
          'l-full-screen': () => this.proxy.maximize
        }
      },
      lstClose: {
        onclick: () => this.method.close()
      }
    }
  },
  methods: {
    open() {
      this.proxy.opened = true
    },
    close() {
      this.proxy.opened = false
      this.method.onclose && this.method.onclose()
    }
  }
}