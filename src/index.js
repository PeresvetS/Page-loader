import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import fsEx from 'fs-extra';
import axios from './lib/axiosFix';
import parser from './lib/parser';
import downloader from './lib/dowloader';
import createName from './lib/createName';

const pageLoader = (address, outputPath = './') => {
  const [newPageName, fileDir] = createName(address);
  const tmpDir = fs.mkdtempSync(`${os.tmpdir()}/`);
  const fullFilePath = path.resolve(outputPath, fileDir);
  const tmpfileDir = path.resolve(tmpDir, fileDir);
  const tmpPathPage = path.resolve(tmpDir, newPageName);
  fs.mkdirSync(tmpfileDir);
  fs.mkdirSync(fullFilePath);
  axios.get(address)
    .then((response) => {
      const [parsedPage, urls] = parser(response.data, fullFilePath);
      const savingPage = fs.writeFile(tmpPathPage, parsedPage);
      if (urls.length > 0) {
        const downloadFiles = downloader(urls, address, tmpfileDir);
        return Promise.all([savingPage, downloadFiles]);
      }
      return savingPage;
    })
    .then(fsEx.move(tmpDir, outputPath, { overwrite: true }, (err) => {
      if (err) console.error(err);
    }))
    .then(console.log('The website is successfully saved locally'))
    .catch(err => err);
};

export default pageLoader;
