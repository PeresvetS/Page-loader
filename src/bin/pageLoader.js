#!/usr/bin/env node

import program from 'commander';
import Listr from 'listr';
import colors from 'colors';
import pageLoader from '../';

program
  .version('0.9.0')
  .description('Download the website and use it locally.')
  .option('-o, --output [path]', 'Path to save the website locally')
  .arguments('<url>')
  .action((url) => {
    const tasks = new Listr([
      {
        title: `Saving page ${url}`.green,
        task: () =>
          new Listr([
            {
              title: 'Uploading'.cyan,
              task: ctx => pageLoader(url, program.output, ctx)
              .then(res => (ctx.res = res))
                .then(() => new Listr([
                  {
                    title: 'Loading page'.cyan,
                    task: () => console.log((`${'✔'.green}  Page ${ctx.page} is ready\n`)),

                  },
                  {
                    title: 'Loading files'.cyan,
                    task: () => ctx.links.forEach(link =>
                    console.log((`${'✔'.green}  File ${link} is ready`))),
                  },
                ])),
            },

          ]),
      },
    ]);
    return tasks.run()
         .then((msg) => {
           console.log((msg.res).green);
         })
         .catch((err) => {
           if (err.response) {
             console.error((`Unfortunately, ${url} download failed. Response code: ${err.response.status}`).red);
             return process.exit(1);
           }
           if (err.code === 'EACCES') {
             console.error(`EACCES: Unfortunately, not enough permissions to write in ${program.output}.`.red);
           }
           if (err.code === 'ETIMEDOUT') {
             console.error('ETIMEDOUT: Operation timed out, check your Internet connection'.red);
           }
           console.error((err.message).red);
           return process.exit(1);
         });
  })
  .parse(process.argv);
