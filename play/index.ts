import { readConfig } from '../src/index';

const start = () => {
  const data = readConfig('test', {
    default: {
      defaultV: 'default value '
    },
  });

  console.log(data);

}

start();
