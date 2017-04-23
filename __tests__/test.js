import os from 'os';
import nock from 'nock';
import path from 'path';
import fs from 'mz/fs';
import pageLoader from '../src/';

let output;
const host = 'http://hexlet.io';
const address = 'http://hexlet.io/courses';
const filesTestPath = 'hexlet-io-courses_file';
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

const oldHtml = path.resolve(testPath, 'hexlet.html');
const htmlFile = path.resolve(testPath, 'hexlet-io-courses.html');
const cssFile = path.resolve(testPath, filesTestPath, '06b254846dd.css');
const jsFile = path.resolve(testPath, filesTestPath, 'cfe020442af.js');
const pngFile = path.resolve(testPath, filesTestPath, '0245fa81cede3144eimage.png');


describe('test pageLoader', () => {
  beforeEach(() => {
    nock('host')
    .get('/courses')
    .reply(301, fs.readFileSync(oldHtml))
    .get('/assets/application-578043761259d7f2af351121161e8f0ae92e33375cc8cb236843706b254846dd.css')
    .reply(200, fs.readFileSync(cssFile))
    .get('/assets/essential-4fac0fef0e085f0f6b4839482069fed772b0b7804e5871db23610cfe020442af.js')
    .reply(200, fs.readFileSync(jsFile))
    .get('https://cdn2.hexlet.io/attachments/d5df265bb0aa50bf1e61b9a700913825b9b34e20/store/b5c5d849575af3af6152cea4663c30e1f624620641b0245fa81cede3144e/image.png')
    .reply(200, fs.readFileSync(pngFile))
    .get('/notExist')
    .reply(404);
  });

  beforeEach(() => {
    output = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  });

  it('test page saving', (done) => {
    pageLoader(address, output)
    .then(result => expect(result).toBe(`Success! The website ${address} have been saved in ${output}`))
    .then(() => fs.readFile(path.resolve(output, 'hexlet-io-courses.html'), 'utf-8'))
    .then((html) => {
      expect(html.data).toBe(htmlFile);
    })
    .then(done)
    .catch(done.fail);
  });

  it('test file saving', (done) => {
    pageLoader(address, output)
    .then(() => fs.readFile(path.resolve(output, filesTestPath, '06b254846dd.css')))
    .then(css => expect(css.data).toBe(cssFile.data))
    .then(() => fs.readFile(path.resolve(output, filesTestPath, 'cfe020442af.js')))
    .then(js => expect(js.data).toBe(jsFile.data))
    .then(() => fs.readFile(path.resolve(output, filesTestPath, '0245fa81cede3144eimage.png')))
    .then((png) => {
      expect(png.data).toBe(pngFile.data);
    })
    .then(done)
    .catch(done.fail);
  });


  it('ENOTFOUND test ', (done) => {
    pageLoader(address, './__fixtures__/test.txt')
    .then(done.fail)
    .catch(done);
  });

  it('ENOENT test ', (done) => {
    pageLoader(address, './error/errr')
    .then(done.fail)
    .catch(done);
  });

  it('ENOTFOUND test ', (done) => {
    pageLoader('http://hexlet.io/error', output)
    .then(done.fail)
    .catch(done);
  });
});
