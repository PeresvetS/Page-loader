import url from 'url';
import path from 'path';
import debug from 'debug';
import fs from 'mz/fs';
import axios from './axiosFix';

const log = debug('page-loader');


const downloadFiles = async (links, address, dir) => {
  await Promise.all(links.map(async (link) => {
    log(`File ${link} is ready`);
    const { hostname } = url.parse(address);
    const name = (path.dirname(link) + path.basename(link)).replace(/\//gi, '-');
    try {
      const file = await axios.get(link, {
        baseURL: `http://${hostname}`,
        responseType: 'arraybuffer' });
      await fs.writeFile(path.resolve(dir, name.length < 10 ?
          name :
          name.slice(name.length / 1.2)), file.data);
    } catch (err) {
      setTimeout(() =>
        console.error(`✗  ${link}, repsponse code: ${err.response.status} [skipped]`.yellow)
      , 2000);
    }
  }));
};

export default downloadFiles;
