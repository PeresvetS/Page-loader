import 'babel-runtime/core-js';
import 'colors';
import path from 'path';
import os from 'os';
import debug from 'debug';
import fs from 'mz/fs';
import fsp from 'fs-extra';
import axios from './lib/axiosFix';
import parsePage from './lib/parser';
import createName from './lib/createName';
import downloadFiles from './lib/downoader';

const log = debug('page-loader');

const listrFiles = (ctx, data) => (ctx ? (ctx.links = data) : null);
const listrPage = (ctx, data) => (ctx ? (ctx.page = data) : null);


const pageLoader = async (address, outputPath = './', ctx = {}) => {
  const tmpDir = await fs.mkdtemp(`${os.tmpdir()}${path.sep}`);
  log(`${tmpDir} have been created`);
  const [newPageName, fileDir] = createName(address);
  const fullFilePath = path.resolve(outputPath, fileDir);
  const tmpfileDir = path.resolve(tmpDir, fileDir);
  const tmpPathPage = path.resolve(tmpDir, newPageName);
  const exist = await fs.exists(outputPath);
  if (!exist) {
    return Promise.reject(new Error(`Unfortunately, the directory ${outputPath} does not exist.`
      .red));
  }
  await fs.mkdir(tmpfileDir);
  log(`Folder ${tmpfileDir} is ready`);
  const response = await axios.get(address);
  log(`Page ${address} have been loaded`);
  listrPage(ctx, address);
  const [newPage, links] = parsePage(response.data, fullFilePath);
  listrFiles(ctx, links);
  await Promise.all([fs.writeFile(tmpPathPage, newPage),
    downloadFiles(links, address, tmpfileDir)]);
  log(`Page and files have been saved in ${tmpDir}`);
  await fsp.copy(tmpDir, outputPath);
  log(`Page and files have been moved to ${outputPath}`);
  return `Success! The website ${address} have been saved in ${outputPath}`;
};


export default pageLoader;
