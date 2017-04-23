import path from 'path';
import os from 'os';
import debug from 'debug';
import fs from 'mz/fs';
import fsp from 'fs-extra';
import axios from './lib/axiosFix';
import parsePage from './lib/parser';
import createName from './lib/createName';

const log = debug('page-loader');

const listrFiles = (ctx, data) => (ctx ? ctx.links = data : null);

const listrPage = (ctx, data) => (ctx ? ctx.page = data : null);

const downloadFiles = (links, site, dir) => Promise.all(links.map((link) => {
  log(`File ${link} is ready`);
  return axios.get(link, {
    baseURL: site,
    responseType: 'arraybuffer' })
      .then(file =>
        fs.writeFile(path.resolve(dir, path.basename(link)), file.data))
        .catch(err => console.error(`✗  ${link} skipped, repsponse code: ${err.response.status} [skipped]`.yellow));
}));


const pageLoader = (address, outputPath = './', ctx = {}) =>
  fs.mkdtemp(`${os.tmpdir()}${path.sep}`)
  .then((tmpDir) => {
    log(`${tmpDir} have been created`);
    const [newPageName, fileDir] = createName(address);
    const fullFilePath = path.resolve(outputPath, fileDir);
    const tmpfileDir = path.resolve(tmpDir, fileDir);
    const tmpPathPage = path.resolve(tmpDir, newPageName);
    return fs.exists(outputPath)
  .then(exist => (exist ? true :
    Promise.reject(new Error(`Unfortunately, the directory ${outputPath} does not exist.`.red))))
    .then(() => fs.mkdir(tmpfileDir))
    .then(() => log(`Folder ${tmpfileDir} is ready`))
    .then(() => axios.get(address))
      .then((response) => {
        log(`Page ${address} have been loaded`);
        listrPage(ctx, address);
        return parsePage(response.data, fullFilePath);
      })
      .then(([newPage, links]) => {
        listrFiles(ctx, links);
        return Promise.all([fs.writeFile(tmpPathPage, newPage),
          downloadFiles(links, address, tmpfileDir)]);
      })
      .then(() => log(`Page and files have been saved in ${tmpDir}`))
      .then(() => fsp.copy(tmpDir, outputPath))
      .then(() => log(`Page and files have been moved to ${outputPath}`));
  })
  .then(() => `Success! The website ${address} have been saved in ${outputPath}`);


export default pageLoader;
