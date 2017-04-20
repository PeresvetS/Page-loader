#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';

program
  .version('0.3.2')
  .description('Download the website and use it locally.')
  .option('-o, --output [path]', 'Path to save the website locally')
  .arguments('<url>')
  .action((url) => {
    pageLoader(url, program.output)
      .catch(err => console.log(err))
      .then(() => { console.log(`The website ${url} is successfully saved locally`); });
  })
  .parse(process.argv);
