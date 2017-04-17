#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';

program
    .version('0.0.1')
    .description('Download the website and use it locally.')
    .option('-o, --output [path], 'Path to save the website locally')
    .arguments('<url>')
    .action((url) => {
        try {
            console.log(pageLoader(url, commander.output));
        } catch(err) {
            console.log(err);
        }
    })
    .parse(process.argv);
