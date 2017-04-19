import path from 'path';
import url from 'url';
import fs from 'mz/fs';
import axios from './axiosFix';

const downloader = (links, site, dir) => {
  links.map(link =>
  axios.get(link, { baseURL: url.resolve(site, '/'), responseType: 'arraybuffer' })
  .then(file => fs.writeFile(path.resolve(dir, path.basename(link)), file.data))
  .catch(err => err));
};

export default downloader;
