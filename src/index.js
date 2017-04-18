import path from 'path';
import fs from 'mz/fs';
import axios from './lib/axiosFix';
import createName from './lib/createName';

const pageLoader = (address, outputPath = './') => {
  try {
    const newFileName = `${createName(address)}.html`;
    const fullPathToOutput = path.resolve(outputPath, newFileName);
    axios.get(address)
    .then(response => fs.writeFile(fullPathToOutput, response.data))
    .catch((err) => {
      throw new Error(`Bad request ${err}`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default pageLoader;
