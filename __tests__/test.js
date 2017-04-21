import os from 'os';
import nock from 'nock';
import path from 'path';
import fs from 'mz/fs';
import pageLoader from '../src/';

let output;
const host = 'http://localhost';
const testPath = './__tests__/__fixtures__';
const correctOutput = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>hello</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/index.js" defer></script>
</head>

<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <img src="img/tea.jpg" alt="image">
  </div>
</body>

</html>`;

const htmlFile = path.resolve(testPath, 'index.html');
const cssFile = path.resolve(testPath, 'localhost_files', 'styles.css');
const jsFile = path.resolve(testPath, 'localhost_files', 'lib.js');
const jpgFile = path.resolve(testPath, 'localhost_files', 'tea.jpg');


describe('test pageLoader', () => {
  beforeEach(() => {
    nock('host')
    .get('/')
    .reply(200, correctOutput)
    .get('/css.styles.css')
    .reply(200, fs.readFileSync(cssFile))
    .get('/js/lib.js')
    .reply(200, fs.readFileSync(jsFile))
    .get('/img/tea.jpg')
    .reply(200, fs.readFileSync(jpgFile))
    .get('/notExist')
    .reply(404);
  });

  beforeEach(() => {
    output = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  });

  it('test page saving', (done) => {
    pageLoader(host, output)
    .then(() => fs.readFile(path.resolve(output, 'localhost.html'), 'utf-8'))
    .then((html) => {
      expect(html.data).toBe(htmlFile);
    })
    .then(done)
    .catch(done.fail);
  });

  it('test file saving', (done) => {
    pageLoader(host, output)
    .then(() => fs.readFile(path.resolve(output, 'localhost_files', 'styles.css')))
    .then(css => expect(css.data).toBe(cssFile.data))
    .then(() => fs.readFile(path.resolve(output, 'localhost_files', 'lib.js')))
    .then(js => expect(js.data).toBe(jsFile.data))
    .then(() => fs.readFile(path.resolve(output, 'localhost_files', 'tea.jpg')))
    .then((jpg) => {
      expect(jpg.data).toBe(jpgFile.data);
    })
    .then(done)
    .catch(done.fail);
  });


  it('ENOTFOUND test ', (done) => {
    pageLoader(host, './__fixtures__/test.txt')
    .then(() => done.fail())
    .catch(e => done(e));
  });

  it('ENOENT test ', (done) => {
    pageLoader(host, './error/errr')
    .then(() => done.fail())
    .catch(e => done(e));
  });

  it('ENOTFOUND test ', (done) => {
    pageLoader('http://localhost/error', output)
    .catch((err) => {
      expect(err.response.status).toBe(404);
      done();
    });
  });
});
