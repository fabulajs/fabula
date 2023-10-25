import './index.css'

export default {
  template: `
    <div class="lstSidebar">
      <div class="lstClose"></div>
      <div class="lstSidebarWr">
        <div>
          <div section="top"></div>
          <div section="content"></div>
        </div>
        <div section="bottom"></div>
      </div>
    </div>`,
  props: {
    params:{
      tabletWidth: {},
      scrollContainer: {},
    },
    proxies: {
      opened: {
        default: false
      },
      minimize: {
        default: false
      }
    },
    methods: {
      onclose: {}
    }
  },
  params: {
    scrollHandler: () => {},
    matchMedia: null
  },
  proxies: {
    tablet: false
  },
  nodes() {
    return {
      lstClose: {
        onclick: () => this.method.close()
      },
      lstSidebar: {
        _class: {
          mini: () => this.proxy.minimize,
          show: () => this.proxy.opened,
          tablet: () => this.proxy.tablet
        },
      }
    }
  },
  methods: {
    resize() {
      const top = this.node.lstSidebar.getBoundingClientRect().top
      this.node.lstSidebar.style.maxHeight = this.param.scrollContainer.clientHeight - top + 'px'
    },
    tabletChange(v) {
      this.proxy.tablet = v.matches
      if (this.proxy.tablet && this.proxy.opened) this.method.close()
    },
    isTablet() {
      return this.proxy.tablet
    },
    open() {
      this.proxy.opened = true
    },
    close() {
      this.proxy.opened = false
      this.method.onclose && this.method.onclose()
    }
  },
  mounted() {
    if (this.param.scrollContainer) {
      this.method.resize()
      this.param.scrollHandler = this.throttling(() => this.method.resize(), 100)
      this.param.scrollContainer.addEventListener('scroll', this.param.scrollHandler)
    }
    this.param.matchMedia = window.matchMedia(`(max-width: ${ this.param.tabletWidth || '560px' })`)
    this.method.tabletChange(this.param.matchMedia)
    this.param.matchMedia.addListener(this.method.tabletChange)
  },
  unmounted() {
    this.param.scrollContainer && this.param.scrollContainer.removeEventListener('scroll', this.param.scrollHandler)
    this.param.matchMedia.removeListener(this.method.tabletChange)
  }
}