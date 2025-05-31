import { useLoading } from 'vue-loading-overlay'

class LoaderService {
  static config = {
    color: '#444444',
    backgroundColor: '#000000',
    opacity: 0.4,
    spinner: 'dots',
    fullPage: true,
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