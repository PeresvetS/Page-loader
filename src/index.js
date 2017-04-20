import path from 'path';
import os from 'os';
import url from 'url';
import fs from 'mz/fs';
import Debug from 'debug';
import fsEx from 'fs-extra';
import axios from './lib/axiosFix';
import parser from './lib/parser';
import createName from './lib/createName';

const debug = Debug('page-loader');


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
        debug(`Page ${address} have loaded`);
        const [parsedPage, links] = parser(response.data, fullFilePath);

        const savingPage = fs.writeFile(tmpPathPage, parsedPage);

        const downloadFiles = links.map(link =>
          axios.get(link, { baseURL: url.resolve(address, '/'), responseType: 'arraybuffer' })
            .then(file => fs.writeFile(path.resolve(tmpfileDir, path.basename(link)), file.data)));

        return Promise.all([savingPage, downloadFiles]);
      })
      .then(() => debug(`Page and files have saved in ${tmpDir}`))
      .then(() => fsEx.move(tmpDir, outputPath, { overwrite: true }, () => {}))
      .then(() => debug(`Page and files have moved to ${outputPath}`));
  });
};


export default pageLoader;
