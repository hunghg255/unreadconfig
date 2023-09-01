import jitiFactory from 'jiti';
import type { JITIOptions } from 'jiti/dist/types';
import { transform, Options } from 'sucrase';

let jiti: ReturnType<typeof jitiFactory> | null = null;
function lazyJiti(option: JITIOptions = {}, transformOpt = {} as Options) {
  return (
    jiti ??
    (jiti = jitiFactory(__filename, {
      interopDefault: true,
      ...option,
      transform: (opts) => {
        return transform(opts.source, {
          //@ts-ignore
          transforms: ['typescript', 'imports'],
          ...transformOpt,
        });
      },
    }))
  );
}

export interface LoadConfOption {
  jiti?: boolean;
  jitiOptions?: JITIOptions;
  transformOption?: Options;
}

export function loadConf<T>(path: string, option: LoadConfOption = {}): T {
  const { jiti = true, jitiOptions, transformOption } = option;
  let config = (function () {
    try {
      if (jiti) {
        return path ? lazyJiti(jitiOptions, transformOption)(path) : {};
      } else {
        return path ? require(path) : {};
      }
    } catch {
      return lazyJiti(jitiOptions, transformOption)(path);
    }
  })();
  return config.default ?? config;
}

//@ts-ignore
export function jsLoader<T>(filepath: string, content: string, option: LoadConfOption = {}): T {
  return loadConf<T>(filepath, option);
}
