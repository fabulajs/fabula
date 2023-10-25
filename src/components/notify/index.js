import './index.css'

export default {
  template: `<div class="fblNtf">
    <div class="fblNtfCont"></div>
  </div>`,
  props: {
    proxies: {
      message: {}
    }
  },
  nodes() {
    return {
      fblNtfCont: {
        textContent: () => this.proxy.message
      }
    }
  }
}