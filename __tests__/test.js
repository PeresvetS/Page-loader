import os from 'os';
import nock from 'nock';
import path from 'path';
import fs from 'mz/fs';
import pageLoader from '../src';


const readFileS = file => fs.readFileSync(path.resolve('./__tests__/__fixtures__', 'localhost_files', file));
const readFile = (dir, file) => fs.readFile(path.resolve(dir, 'localhost_files', file));

const cssFile = readFileS('styles.css');
const jsFile = readFileS('lib.js');
const jpgFile = readFileS('tea.jpg');


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


beforeEach(() => {
  nock('http://localhost')
  .get('/')
  .reply(200, correctOutput)
  .get('/css.styles.css')
  .reply(200, cssFile)
  .get('/js/lib.js')
  .reply(200, jsFile)
  .get('/img/tea.jpg')
  .reply(200, jpgFile)
  .get('/notExist')
  .reply(404);
});

describe('test pageLoader', () => {
  const url = 'http://localhost';
  const output = fs.mkdtempSync(`${os.tmpdir()}/`);
  it('test page saving', (done) => {
    pageLoader(url, output);
    fs.readFile(path.resolve(output, 'localhost-.html'), 'utf-8')
    .then((html) => {
      expect(html).toBe(correctOutput);
      done();
    })
    .catch(done);
  });
  it('test file saving', (done) => {
    const output2 = fs.mkdtempSync(`${os.tmpdir()}/`);
    pageLoader(url, output2);
    readFile(output, 'styles.css')
      .then((css) => {
        expect(css.data).toBe(cssFile.data);
        done();
      })
    .catch(done);
    readFile(output, 'lib.js')
    .then((js) => {
      expect(js.data).toBe(jsFile.data);
      done();
    })
    .catch(done);
    readFile(output, 'tea.jpg')
    .then((jpg) => {
      expect(jpg.data).toBe(jpgFile.data);
      done();
    })
    .catch(done);
  });
});
