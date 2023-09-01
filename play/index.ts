import { readConfig } from '../src/index';

const start = () => {
  const data = readConfig('test', {
    default: {
      testItem2: 'some value '
    },
  });

  console.log(data);

}

start();
