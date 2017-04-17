import url from 'url';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';

const createName = (url) => {
    const parsedUrl = url.parse(url);
    const newName  = url.format({
        hostname: parsedUrl.hostname.replace(/[^0-9a-z]/gi, '-'),
    });
    return newName;
}

const pageLoader = (url, outputPath = './') => {
    try {
    const htmlGetResp = axios.get(url);
    const tmpDir = fs.mkdtempSync(`${os.tmpdir() | path.sep}`);
    const newFileName = createName(url);
    const fullPathFile = path.resolve(outputPath, newFileName);
    }
    catch(err) {
        console-log(err);
    }
};

export default pageLoader;
