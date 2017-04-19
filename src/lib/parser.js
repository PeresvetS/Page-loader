import path from 'path';
import cheerio from 'cheerio';


const targetTags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const parser = (page, dir) => {
  const $ = cheerio.load(page);
  const urls = Object.keys(targetTags)
  .reduce((acc, tag) =>
    [...acc,
      ...$(tag)
  .map((i, el) => $(el).attr(targetTags[tag]))
  .get()], []);
  const parsedPage = urls.reduce((url, acc) =>
    url.replace(acc, `${dir}/${path.basename(acc)}`), page);

  return [parsedPage, urls];
};

export default parser;
