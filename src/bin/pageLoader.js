#!/usr/bin/env node

import program from 'commander';
import colors from 'colors';
import Listr from 'listr';
import pageLoader from '../';

program
  .version('0.4.2')
  .description('Download the website and use it locally.')
  .option('-o, --output [path]', 'Path to save the website locally')
  .arguments('<url>')
  .action((url) => {
    const tasks = new Listr([
      {
        title: 'Upload Page',
        task: ctx => pageLoader(url, program.output)
          .then(res => (ctx.res = res)),
      },
    ]);
    return tasks.run()
         .then((msg) => {
           console.log(colors.green(msg.res));
         })
         .catch((err) => {
           if (err.response) {
             console.error((`Unfortunately, ${url} download failed. Response code: ${err.response.status}`).red);
             return process.exit(process.exitCode);
           }
           if (err.code === 'EACCES') {
             console.error(`EACCES: Unfortunately, not enough permissions to write in ${program.output}.`.red);
           }
           if (err.code === 'ETIMEDOUT') {
             console.error('ETIMEDOUT: Operation timed out, check your Internet connection'.red);
           }
           console.error((err.message).red);
           return process.exit(process.exitCode);
         });
  })
  .parse(process.argv);
