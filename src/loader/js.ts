/* eslint-disable ts/no-require-imports */
/* eslint-disable node/prefer-global/process */
import type { JitiOptions } from 'jiti'
import type { Options } from 'sucrase'
import { createJiti } from 'jiti'

function detectOSType() {
  switch (process.platform) {
    case 'win32': return 'Windows'
    case 'linux': return 'Linux'
    case 'darwin': return 'Mac'
    default: return 'UNKNOWN'
  }
}

function lazyJiti(rootDir: string = process.cwd(), option: JitiOptions = {}) {
  const split = rootDir.split('/')
  const _require = createJiti(rootDir, { interopDefault: true, ...option })

  if (detectOSType() === 'Windows') {
    return _require(`${split[split.length - 1]}`)
  }

  return _require(`./${split[split.length - 1]}`)
}

export interface LoadConfOption {
  jiti?: boolean
  jitiOptions?: JitiOptions
  transformOption?: Options
}

export function loadConf<T>(path: string, option: LoadConfOption = {}): T {
  const { jiti = true, jitiOptions } = option
  const config = (function () {
    try {
      if (jiti) {
        return path ? lazyJiti(path, jitiOptions) : {}
      }
      else {
        return path ? require(path) : {}
      }
    }
    catch {
      return lazyJiti(path, jitiOptions)
    }
  })()
  return config.default ?? config
}

export function jsLoader<T>(filepath: string, content: string, option: LoadConfOption = {}): T {
  return loadConf<T>(filepath, option)
}
