import jitiFactory from 'jiti';
import type { JITIOptions } from 'jiti/dist/types';
import { Options } from 'sucrase';

function lazyJiti(rootDir: string = process.cwd(), option: JITIOptions = {}) {
  const split = rootDir.split('/');
  const _require = jitiFactory(rootDir, { interopDefault: true, esmResolve: true, ...option });
  return _require(`${split[split.length - 1]}`);
}

export interface LoadConfOption {
  jiti?: boolean;
  jitiOptions?: JITIOptions;
  transformOption?: Options;
}

export function loadConf<T>(path: string, option: LoadConfOption = {}): T {
  const { jiti = true, jitiOptions } = option;
  let config = (function () {
    try {
      if (jiti) {
        return path ? lazyJiti(path, jitiOptions): {};
      } else {
        return path ? require(path) : {};
      }
    } catch {
      return lazyJiti(path, jitiOptions);
    }
  })();
  return config.default ?? config;
}

//@ts-ignore
export const jsLoader =  <T>(filepath: string, content: string, option: LoadConfOption = {}): T => {
  return loadConf<T>(filepath, option);
}
