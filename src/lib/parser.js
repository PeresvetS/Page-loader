import path from 'path';
import cheerio from 'cheerio';


const targetTags = {
  link: 'href',
  script: 'src',
  img: 'src',
};

const parsePage = (page, dir) => {
  const $ = cheerio.load(page);
  const urls = Object.keys(targetTags)
  .reduce((acc, tag) =>
    [...acc,
      ...$(tag)
  .map((i, el) => $(el).attr(targetTags[tag]))
  .get()], []);

  const newPage = urls.reduce((url, acc) =>
    url.replace(acc, `${dir}/${path.basename(acc)}`), page);

  return [newPage, urls];
};

export default parsePage;
