import block from '../block'
import button from '../UI/button'
import dialog from '../UI/dialog'

export default {
  template: `
    <div class="fblDialog"></div>
    <div class="fblMain l-container l-content">
      <h2 class="fblMainHead"></h2>
      <div class="fblForm"></div>
      <div class="fblSubmit"></div>
    </div>`,
  props: {
    proxies: {
      error: { store: 'form' }
    },
    methods: {
      submit: { store: 'form' }
    }
  },
  nodes() {
    return {
      fblMainHead: {
        textContent: this.entry.mainHead
      },
      fblForm: {
        component: {
          src: block,
          params: {
            target: this.entry.form,
            path: []
          }
        }
      },
      fblSubmit: {
        component: {
          src: button,
          params: {
            text: this.entry.localTokens.submit,
            size: 'normal'
          },
          proxies: {
            disabled: () => this.proxy.error
          },
          methods: {
            change: () =>this.method.submit(),
          }
        }
      },
      fblDialog: {
        component: {
          src: dialog,
          sections: {
            content: {}
          }
        }
      }
    }
  },
  mounted() {
    this.bus.popup = this.node.fblDialog
  }
}