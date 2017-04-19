#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';

program
  .version('0.2.5')
  .description('Download the website and use it locally.')
  .option('-o, --output [path]', 'Path to save the website locally')
  .arguments('<url>')
  .action((url) => {
    try {
      pageLoader(url, program.output);
    } catch (err) {
      console.log(err);
    }
  })
  .parse(process.argv);
