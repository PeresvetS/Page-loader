import path from 'path';
import fs from 'mz/fs';
import axios from './lib/axiosFix';
import createName from './lib/createName';

const pageLoader = (address, outputPath = './') => {
  const newFileName = `${createName(address)}.html`;
  const fullPathToOutput = path.resolve(outputPath, newFileName);
  axios.get(address)
    .then(response => fs.writeFile(fullPathToOutput, response.data))
    .catch((err) => {
      console.log(`Bad request ${err}`);
    });
};

export default pageLoader;
