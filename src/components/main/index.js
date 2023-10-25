import block from '../block'
import button from '../UI/button'
import dialog from '../UI/dialog'
import sidebar from '../UI/sidebar'
import notify from '../notify'

export default {
  template: `
    <div class="fblWr">
      <div class="fblDialog"></div>
      <div class="fblMain l-container l-content">
        <h2 class="fblMainHead"></h2>
        <div class="fblForm"></div>
        <div class="l-fx l-gap">
            <div class="fblClear"></div>
            <div class="fblSubmit"></div>
        </div>
      </div>
      <div class="fblSidebar"></div>
    </div>`,
  props: {
    proxies: {
      error: { store: 'form' }
    },
    methods: {
      submit: { store: 'form' },
      clear: { store: 'form' }
    }
  },
  proxies: {
    message: ''
  },
  nodes() {
    return {
      fblMainHead: {
        textContent: this.bus.entry.mainHead
      },
      fblForm: {
        component: {
          src: block,
          params: {
            target: this.bus.entry.form,
            path: []
          }
        }
      },
      fblSubmit: {
        component: {
          src: button,
          params: {
            text: this.bus.local.submit,
            size: 'normal'
          },
          proxies: {
            disabled: () => this.proxy.error
          },
          methods: {
            change: async () => {
              this.proxy.message = this.bus.entry.local.requestMessage
              await this.bus.dialog.section.content.mount({
                src: notify,
                proxies: {
                  message: () => this.proxy.message
                }
              })
              this.bus.dialog.method.open()
              this.proxy.message = await this.method.submit()
            }
          }
        }
      },
      fblClear: {
        component: {
          src: button,
          params: {
            text: this.bus.local.clear,
            size: 'normal'
          },
          methods: {
            change: async () => {
              this.proxy.message = this.bus.entry.local.clearMessage
              await this.bus.dialog.section.content.mount({
                src: notify,
                params: {
                  dialog: true
                },
                proxies: {
                  message: () => this.proxy.message
                },
                methods: {
                  confirm: () => {
                    this.method.clear()
                  }
                }
              })
              this.bus.dialog.method.open()
            }
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
      },
      fblSidebar: {
        component: {
          src: sidebar,
          sections: {
            content: {}
          }
        }
      },
    }
  },
  mounted() {
    this.bus.dialog = this.node.fblDialog
    this.bus.sidebar = this.node.fblSidebar
  }
}