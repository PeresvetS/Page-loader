#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';

program
  .version('0.3.6')
  .description('Download the website and use it locally.')
  .option('-o, --output [path]', 'Path to save the website locally')
  .arguments('<url>')
  .action((url) => {
    pageLoader(url, program.output)
      .then(msg => console.log(msg))
      .catch(err => console.error(err));
  })
  .parse(process.argv);
