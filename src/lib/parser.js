import path from 'path';
import cheerio from 'cheerio';


const targetTags = {
  link: 'href',
  script: 'src',
  img: 'src',
  meta: 'content',
};

const parsePage = (page, dir) => {
  const $ = cheerio.load(page);
  const urls = Object.keys(targetTags)
  .reduce((acc, tag) =>
    [...acc,
      ...$(tag)
  .map((i, el) => $(el).attr(targetTags[tag]))
  .get()], []);

  const newPage = urls.reduce((url, acc) => {
    const name = (path.dirname(acc) + path.basename(acc))
    .replace(/\//gi, '-');
    return url.replace(acc, `${dir}/${name.length < 10 ?
       name :
       name.slice(name.length / 1.2)}`);
  }, page);

  return [newPage, urls];
};

export default parsePage;
