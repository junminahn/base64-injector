const fs = require('fs');
const assert = require('assert');
const AssertionError = require('assert').AssertionError;

const base64Injector = require('./index');

describe('Generate base64 data src', function() {
  it(`should create a eot data src`, function(done) {
    const dataSrc = base64Injector.encodeToFontDataSrcSync('./fonts/akronim-v9-latin-regular.eot');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a svg data src`, function(done) {
    const dataSrc = base64Injector.encodeToFontDataSrcSync('./fonts/akronim-v9-latin-regular.svg');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a ttf data src`, function(done) {
    const dataSrc = base64Injector.encodeToFontDataSrcSync('./fonts/akronim-v9-latin-regular.ttf');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a woff data src`, function(done) {
    const dataSrc = base64Injector.encodeToFontDataSrcSync('./fonts/woff/akronim-v9-latin-regular.woff');
    const expected = fs.readFileSync('./fonts/woff/akronim-v9-latin-regular.woff.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a woff2 data src`, function(done) {
    const dataSrc = base64Injector.encodeToFontDataSrcSync('./fonts/woff/akronim-v9-latin-regular.woff2');
    const expected = fs.readFileSync('./fonts/woff/akronim-v9-latin-regular.woff2.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });

  it(`should create a png data src`, function(done) {
    const dataSrc = base64Injector.encodeToDataSrcSync('./images/apple.png');
    const expected = fs.readFileSync('./images/apple.png.base64', 'utf8');
    assert.equal(dataSrc, expected);
    done();
  });
});

describe('Generate base64 font data src asynchronously', function() {
  it(`should create a eot data src`, async function() {
    const dataSrc = await base64Injector.encodeToFontDataSrc('./fonts/akronim-v9-latin-regular.eot');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.eot.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a svg data src`, async function() {
    const dataSrc = await base64Injector.encodeToFontDataSrc('./fonts/akronim-v9-latin-regular.svg');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.svg.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a ttf data src`, async function() {
    const dataSrc = await base64Injector.encodeToFontDataSrc('./fonts/akronim-v9-latin-regular.ttf');
    const expected = fs.readFileSync('./fonts/akronim-v9-latin-regular.ttf.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a woff data src`, async function() {
    const dataSrc = await base64Injector.encodeToFontDataSrc('./fonts/woff/akronim-v9-latin-regular.woff');
    const expected = fs.readFileSync('./fonts/woff/akronim-v9-latin-regular.woff.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });

  it(`should create a woff2 data src`, async function() {
    const dataSrc = await base64Injector.encodeToFontDataSrc('./fonts/woff/akronim-v9-latin-regular.woff2');
    const expected = fs.readFileSync('./fonts/woff/akronim-v9-latin-regular.woff2.base64', 'utf8');
    assert.equal(dataSrc, expected);
  });
});

describe('Replace font src with base64 data src', function() {
  it(`should replace src`, function(done) {
    const tmp = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    base64Injector.injectBase64Sync('./fonts', './example/_tmp.css');
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.equal(result, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const tmp = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    await base64Injector.injectBase64('./fonts', './example/_tmp.css');
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.equal(result, expected);
  });
});

describe('Replace background src with base64 data src', function() {
  it(`should replace src`, function(done) {
    const tmp = fs.readFileSync('./example/fruit-background.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    base64Injector.injectBase64Sync('./images', './example/_tmp.css');
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/fruit-background.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.equal(result, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const tmp = fs.readFileSync('./example/fruit-background.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    await base64Injector.injectBase64('./images', './example/_tmp.css');
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/fruit-background.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.equal(result, expected);
  });
});

describe('Replace image src in img tag', function() {
  it(`should replace src`, function(done) {
    const tmp = fs.readFileSync('./example/example.html', 'utf8');
    fs.writeFileSync('./example/_tmp.html', tmp, 'utf8');

    base64Injector.injectBase64Sync('./images', './example/_tmp.html');
    const result = fs.readFileSync('./example/_tmp.html', 'utf8');
    const expected = fs.readFileSync('./example/example.base64.html', 'utf8');
    fs.unlinkSync('./example/_tmp.html');

    assert.equal(result, expected);
    done();
  });
});

describe('Test context', function() {
  it(`should fail in replacing src within image context`, function(done) {
    const result = base64Injector.image.injectBase64Sync('./images', './example/fruit-background.css', {
      resave: false,
    });
    assert.equal(result.nModified, 1);
    done();
  });

  it(`should fail in replacing src within font context`, function(done) {
    const result = base64Injector.font.injectBase64Sync('./images', './example/fruit-background.css', {
      resave: false,
    });
    assert.equal(result.nModified, 0);
    done();
  });
});

describe('Replace image url with base64 data url', function() {
  it(`should replace src`, function(done) {
    const content = fs.readFileSync('./example/example.html', 'utf8');
    const result = base64Injector.injectBase64Sync.fromHTML('./images', content);
    const expected = fs.readFileSync('./example/example.base64.html', 'utf8');
    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const content = fs.readFileSync('./example/example.html', 'utf8');
    const result = await base64Injector.injectBase64.fromHTML('./images', content);
    const expected = fs.readFileSync('./example/example.base64.html', 'utf8');
    assert.equal(result.content, expected);
  });
});

describe('Replace font src in content with base64 data src', function() {
  it(`should replace src`, function(done) {
    const content = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    const result = base64Injector.injectBase64Sync.fromCSS('./fonts', content);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');
    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const content = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    const result = await base64Injector.injectBase64.fromCSS('./fonts', content);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.content, expected);
  });
});

describe('Replace font src in buffer with base64 data src', function() {
  it(`should replace src`, function(done) {
    const buffer = fs.readFileSync('./example/akronim-fontface.css');
    const result = base64Injector.injectBase64Sync.fromCSS('./fonts', buffer);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const buffer = fs.readFileSync('./example/akronim-fontface.css');
    const result = await base64Injector.injectBase64.fromCSS('./fonts', buffer);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.content, expected);
  });

  it(`should replace src by comparing base names`, function(done) {
    const buffer = fs.readFileSync('./example/akronim-fontface.css');
    const result = base64Injector.injectBase64Sync.fromCSS('./fonts', buffer);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.content, expected);
    done();
  });

  it(`should replace src by comparing base names asynchronously`, async function() {
    const buffer = fs.readFileSync('./example/akronim-fontface.css');
    const result = await base64Injector.injectBase64.fromCSS('./fonts', buffer);
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.content, expected);
  });
});

describe('Replace font src with base64 data src without resave', function() {
  it(`should replace src`, function(done) {
    const result = base64Injector.injectBase64Sync('./fonts', './example/akronim-fontface.css', { resave: false });
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.contents[0].modified, true);
    assert.equal(result.contents[0].content, expected);
    done();
  });

  it(`should replace src asynchronously`, async function() {
    const result = await base64Injector.injectBase64('./fonts', './example/akronim-fontface.css', { resave: false });
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');

    assert.equal(result.contents[0].modified, true);
    assert.equal(result.contents[0].content, expected);
  });
});

describe('Replace font src with base64 data src with selected font files', function() {
  it(`should replace src`, function(done) {
    const tmp = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    base64Injector.injectBase64Sync(
      [
        './fonts/akronim-v9-latin-regular.eot',
        './fonts/akronim-v9-latin-regular.svg',
        './fonts/akronim-v9-latin-regular.ttf',
        './fonts/woff/akronim-v9-latin-regular.woff',
        './fonts/woff/akronim-v9-latin-regular.woff2',
      ],
      './example/_tmp.css'
    );
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.equal(result, expected);
    done();
  });

  it(`should replace a single src and fail`, async function(done) {
    const tmp = fs.readFileSync('./example/akronim-fontface.css', 'utf8');
    fs.writeFileSync('./example/_tmp.css', tmp, 'utf8');

    base64Injector.injectBase64Sync('./fonts/akronim-v9-latin-regular.eot', './example/_tmp.css');
    const result = fs.readFileSync('./example/_tmp.css', 'utf8');
    const expected = fs.readFileSync('./example/akronim-fontface.base64.css', 'utf8');
    fs.unlinkSync('./example/_tmp.css');

    assert.notEqual(result, expected);
    done();
  });
});
