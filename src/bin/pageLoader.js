#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';

program
    .version('0.0.1')
    .description('Download the website and use it locally.')
    .option('-u, --url [target]')
    .option('-o, --output [path to save]')
    .arguments('<output><url>')
    .action((output, url) => {
      console.log(pageLoader(output, url));
    })
    .parse(process.argv);
