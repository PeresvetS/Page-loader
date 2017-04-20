import path from 'path';
import os from 'os';
import url from 'url';
import fs from 'mz/fs';
import _debug from 'debug';
import fsEx from 'fs-extra';
import axios from './lib/axiosFix';
import parsePage from './lib/parser';
import createName from './lib/createName';

const debug = _debug('page-loader');

const downloader = (links, site, dir) => links.map(link =>
    axios.get(link, {
      baseURL: url.resolve(site, '/'),
      responseType: 'arraybuffer' })
      .then(file =>
        fs.writeFile(path.resolve(dir, path.basename(link)), file.data)));


const pageLoader = (address, outputPath = './') => {
  const [newPageName, fileDir] = createName(address);
  return fs.mkdtemp(`${os.tmpdir()}${path.sep}`)
  .then((tmpDir) => {
    const fullFilePath = path.resolve(outputPath, fileDir);
    const tmpfileDir = path.resolve(tmpDir, fileDir);
    const tmpPathPage = path.resolve(tmpDir, newPageName);
    debug(`${tmpDir} have been created`);
    return fs.mkdir(tmpfileDir)
    .then(() => debug(`Folder ${tmpfileDir} is ready`))
    .then(() => axios.get(address))
      .then((response) => {
        debug(`Page ${address} have been loaded`);
        return parsePage(response.data, fullFilePath);
      })
      .then(([newPage, links]) =>
      Promise.all([fs.writeFile(tmpPathPage, newPage),
        downloader(links, address, tmpfileDir)]))
      .then(() => debug(`Page and files have been saved in ${tmpDir}`))
      .then(() => fsEx.move(tmpDir, outputPath, { overwrite: true }, () => {}))
      .then(() => debug(`Page and files have been moved to ${outputPath}`));
  });
};


export default pageLoader;
