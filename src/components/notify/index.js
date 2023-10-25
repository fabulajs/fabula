import './index.css'
import buttons from '../UI/buttons'

export default {
  template: `<div class="fblNtf">
    <div class="fblNtfCont"></div>
    <div class="fblNtfBtns">sfsfgsgs</div>
  </div>`,
  props: {
    proxies: {
      message: {}
    },
    methods: {
      confirm: {}
    }
  },
  nodes() {
    return {
      fblNtfCont: {
        textContent: () => this.proxy.message
      },
      fblNtfBtns : {
        component: {
          src: buttons,
          proxies: {
            value: () => this.bus.local.cancel,
            disabled: {},
            error: {}
          },
          params: {
            options: {
              buttons: [this.bus.local.cancel || 'Cancel', this.bus.local.confirm || 'Ok']
            }
          },
          methods: {
            change: (v, index) => {
              if (index === 1) this.method.confirm()
              this.bus.dialog.method.close()
            }
          }
        }
      }
    }
  }
}