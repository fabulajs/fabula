import button from '../button'
import './index.css'

export default {
  template: `<div class="lstLbl l-label"></div>
  <div class="lstNst l-fx l-field l-br l-gap">
    <div class="lstNstBtn"></div>
    <div class="lstNstCont l-fx"></div>
  </div>`,
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {}
    },
    params: {
      type: { default: 'text'},
      name: { default: '' },
      size: { default: 'small' },
      text: {},
      options: {}
    },
    methods: {
      change: {}
    }
  },
  params: {
    windowType: 'dialog'
  },
  sources: {
    popup: () => import('./popup')
  },
  nodes() {
    return {
      lstLbl: {
        textContent: () => this.param.text
      },
      lstNst: {
        _class: {
          lstNstErr: () => this.proxy.error
        }
      },
      lstNstBtn: {
        component: {
          src: button,
          params: {
            text: '…',
            size: 'mini'
          },
          proxies: {
            disabled: () => {}
          },
          methods: {
            change: async () => {
              await this.bus[this.param.windowType].section.content.mount({
                src: this.source.popup,
                params: {
                  text: this.param.text,
                  list: this.param.options.list,
                  buttonsText: () => this.bus.local
                },
                proxies: {
                  list: this.param.options.list,
                  selected: this.proxy.value,
                },
                methods: {
                  onapply: (arr) => {
                    this.method.change?.(arr)
                    this.bus[this.param.windowType].method.close()
                  },
                  onclose: () => {
                    this.bus[this.param.windowType].method.close()
                  }
                }
              })
              this.bus[this.param.windowType].method.open()
            }
          }
        }
      },
      lstNstCont: {
        _html: () => this.method.render()
      }
    }
  },
  methods: {
    render() {
      return this.proxy.value.reduce((accum, el) => accum + `<span class="l-br" size="mini">${el}</span>`, '')
    }
  },
  created() {
    if (this.param.options.windowType) this.param.windowType = this.param.options.windowType
  }
}