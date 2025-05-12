import { loaderService } from "../common/loader.service";

class LoaderStorage {
  static show(config) {
    loaderService.show(config)
  }

  static hide(force = false) {
    loaderService.hide(force)
  }

  static async withLoader(promise, config) {
    this.show(config)
    try {
      return await promise
    } finally {
      this.hide()
    }
  }
}

export default LoaderStorage;