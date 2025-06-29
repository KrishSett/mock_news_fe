import { useLoading } from 'vue-loading-overlay'

class LoaderService {
  static config = {
    color: '#777777',
    backgroundColor: '#e1e1e1',
    opacity: 0.9,
    spinner: 'dots',
    fullPage: false,
    canCancel: false,
    lockScroll: true
  }

  constructor() {
    if (LoaderService.instance) {
      return LoaderService.instance
    }

    this.loader = null
    this.activeLoaders = 0
    this.loadingPlugin = useLoading()

    LoaderService.instance = this
  }

  show(config = {}) {
    this.activeLoaders++

    if (!this.loader) {
      this.loader = this.loadingPlugin.show({
        ...LoaderService.config,
        ...config
      })
    }
  }

  hide(force = false) {
    if (this.activeLoaders > 0 && !force) {
      this.activeLoaders--
    }

    if (this.activeLoaders === 0 || force) {
      this.loader?.hide()
      this.loader = null
      if (force) this.activeLoaders = 0
    }
  }
}

// Export a singleton instance
export const loaderService = new LoaderService()