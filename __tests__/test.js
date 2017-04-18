import os from 'os';
import nock from 'nock';
import path from 'path';
import fs from 'mz/fs';
import pageLoader from '../src';

test('test pageLoader', () => {
  const url = 'http://localhost';
  const output = os.tmpdir();
  const correctOutput = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>hello</title>
    <link rel="stylesheet" href="css/styles.css">
  </head>
  <body>
    <div class="container">
    <h1>Hello, World!</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  </body>
  </html>`;

  beforeEach(() => {
    nock('http://localhost')
    .get('/')
    .reply(200, correctOutput);
  });
  it('test page saving', (done) => {
    pageLoader(url, output)
    .then(() => fs.readFile(path.resolve(output, 'localhost-test-.html'), 'utf-8'))
    .then(html => expect(html).toBe(correctOutput))
    .then(() => done());
  });
});
