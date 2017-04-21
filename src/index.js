import path from 'path';
import os from 'os';
import url from 'url';
import fs from 'mz/fs';
import debug from 'debug';
import fsp from 'fs-promise';
import axios from './lib/axiosFix';
import parsePage from './lib/parser';
import createName from './lib/createName';

const log = debug('page-loader');

const downloadFiles = (links, site, dir) => links.map(link =>
    axios.get(link, {
      baseURL: url.resolve(site, '/'),
      responseType: 'arraybuffer' })
      .then(file =>
        fs.writeFile(path.resolve(dir, path.basename(link)), file.data)));


const pageLoader = (address, outputPath = './') => {
  const [newPageName, fileDir] = createName(address);
  const tmpDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  log(`${tmpDir} have been created`);
  const fullFilePath = path.resolve(outputPath, fileDir);
  const tmpfileDir = path.resolve(tmpDir, fileDir);
  const tmpPathPage = path.resolve(tmpDir, newPageName);
  return fs.exists(outputPath)
  .then(exist => (exist ? true :
    Promise.reject(`Unfortunately, the directory ${outputPath} does not exist.`)))
  .then(() => fsp.open(outputPath, 'r'))
  .then(() => fs.mkdir(tmpfileDir))
  .then(() => log(`Folder ${tmpfileDir} is ready`))
  .then(() => axios.get(address))
    .then((response) => {
      log(`Page ${address} have been loaded`);
      return parsePage(response.data, fullFilePath);
    })
    .then(([newPage, links]) =>
    Promise.all([fs.writeFile(tmpPathPage, newPage),
      downloadFiles(links, address, tmpfileDir)]))
    .then(() => log(`Page and files have been saved in ${tmpDir}`))
    .then(() => fsp.move(tmpDir, outputPath, { overwrite: true }, () => {}))
    .then(() => log(`Page and files have been moved to ${outputPath}`))
    .then(() => Promise.resolve(`Success! The website ${address} have been saved in ${outputPath}`))
    .catch((err) => {
      if (err.response || err.code === 'ENOTFOUND') {
        return Promise.reject(`Unfortunately, ${address} download failed. Response code: ${err.response.status}`);
      }
      if (err.code === 'EACCES') {
        return Promise.reject(`Unfortunately, not enough permissions to write in ${outputPath}.`);
      }
      if (err.code === 'ENOTDIR') {
        return Promise.reject(`Given pathname ${outputPath} existed, but was not a directory as expected.`);
      }
      if (err.code === 'ETIMEDOUT') {
        return Promise.reject('Operation timed out, check your Internet connection');
      }
      return Promise.reject(err);
    });
};


export default pageLoader;
