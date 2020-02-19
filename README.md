# base64-injector

[![NPM version](https://img.shields.io/npm/v/base64-injector.svg)](https://www.npmjs.com/package/base64-injector)
[![Dependency Status](https://david-dm.org/junminahn/base64-injector/status.svg)](https://david-dm.org/junminahn/base64-injector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)

Convert font/image to base64 data url, and to inject src into style/html files

## Installation
```sh
$ npm install base64-injector
```

## API
### .encodeToDataUrl (sourcePath)
* Convert font/image file(s) to base64 data url asynchronously
* `sourcePath`: {string} | {Array{string}}
    * file path(s)
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataUrl = await base64Injector.encodeToDataUrl('fonts/myfont-regular.ttf')
// => data:font/truetype;charset=utf-8;base64,<base64>
```

### .encodeToDataUrlSync (sourcePath)
* Convert font/image file(s) to base64 data url synchronously
* `sourcePath`: {string} | {Array{string}}
    * file path(s)
* Returns: {string} | {Array{string}}
```js
const dataUrl = base64Injector.encodeToDataUrlSync('fonts/myfont-regular.woff')
// => data:application/font-woff;charset=utf-8;base64,<base64>
```

### .encodeToDataSrc (sourcePath)
* Convert font/image file(s) to base64 data src asynchronously
* `sourcePath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataSrc = await base64Injector.encodeToDataSrc('images/apple.png')
// => url(data:image/png;base64,<base64>)
```

### .encodeToDataSrcSync (sourcePath)
* Convert font/image file(s) to base64 data src synchronously
* `sourcePath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataSrc = base64Injector.encodeToDataSrcSync('images/pear.png')
// ==> url(data:image/png;base64,<base64>)
```

### .encodeToFontDataSrc (sourcePath)
* Convert font/image file(s) to base64 font data src asynchronously
* `sourcePath`: {string} | {Array{string}}
* Returns: {Promise} containing {string} | {Array{string}}
```js
const dataSrc = await base64Injector.encodeToFontDataSrc('fonts/myfont-regular.ttf')
// => url(data:font/truetype;charset=utf-8;base64,<base64>) format('truetype')
```

### .encodeToFontDataSrcSync (sourcePath)
* Convert font/image file(s) to base64 font data src synchronously
* `sourcePath`: {string} | {Array{string}}
* Returns: {string} | {Array{string}}
```js
const dataSrc = base64Injector.encodeToFontDataSrcSync('fonts/myfont-regular.woff')
// => url(data:application/font-woff;charset=utf-8;base64,<base64>) format('woff')
```

### .injectBase64 (sourcePath, targetPath[, options])
* Replace font/image src url with base64 data url asynchronously
* `sourcePath`: {string} | {Array{string}}
* `targetPath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in style/html file matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
    * `targetTypes`: {Array{string}}
        * allowed target types
        * default to ['.css', '.html']
    * `resave`: {boolean}
        * resave modified target files
        * default to true
* Returns: {Promise} containing {true | Error} | {result | Error}
```js
const result = await base64Injector.injectBase64('./fonts', './styles')
// => true

const result = await base64Injector.injectBase64('./images', './styles', { resave: false })
// => { n: 3, nModified: 2, contents: [{ modified: true, filepath: './styles/style1.css', content: '...' }, ...] }
```

### .injectBase64Sync (sourcePath, targetPath[, options])
* Replace font/image src url with base64 data url synchronously
* `sourcePath`: {string} | {Array{string}}
* `targetPath`: {string} | {Array{string}}
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in style/html file matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
    * `targetTypes`: {Array{string}}
        * allowed target types
        * default to ['.css', '.html']
    * `resave`: {boolean}
        * resave modified target files
        * default to true
* Returns: {true | Error} | {result | Error}
```js
const result = base64Injector.injectBase64('./fonts', './styles')
// => true

const result = base64Injector.injectBase64('./images', './styles', { resave: false })
// => { n: 3, nModified: 2, contents: [{ modified: true, filepath: './styles/style1.css', content: '...' }, ...] }
```

### .injectBase64.fromCSS (sourcePath, css[, options])
* Replace font/image url(s) in css with base64 data url asynchronously
* `sourcePath`: {string} | {Array{string}}
* `css`: {string | Buffer}
    * file content | buffer 
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in css matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
* Returns: {Promise} containing {result | Error}
```js
const result = await base64Injector.injectBase64.fromCSS('./fonts', '...@font-face {...')
// => { modified: false, content: '...', nFont: 0, nImage: 0 }
```

### .injectBase64Sync.fromCSS (sourcePath, css[, options])
* Replace font/image url(s) in css with base64 data url synchronously
* `sourcePath`: {string} | {Array{string}}
* `css`: {string | Buffer}
    * file content | buffer 
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in css matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
* Returns: {result | Error}
```js
const result = base64Injector.injectBase64.fromCSS('./fonts', '...@font-face {...')
// => { modified: false, content: '...', nFont: 0, nImage: 0 }
```

### .injectBase64.fromHTML (sourcePath, html[, options])
* Replace font/image url(s) in html with base64 data url asynchronously
* `sourcePath`: {string} | {Array{string}}
* `html`: {string | Buffer}
    * file content | buffer 
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in html matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
* Returns: {Promise} containing {result | Error}
```js
const result = await base64Injector.injectBase64.fromHTML('./images', '...<body><img src="apple.png"...</body>')
// => { modified: true, content: '...', nFont: 0, nImage: 1 }
```

### .injectBase64Sync.fromHTML (sourcePath, html[, options])
* Replace font/image url(s) in html with base64 data url synchronously
* `sourcePath`: {string} | {Array{string}}
* `html`: {string | Buffer}
    * file content | buffer 
* `options`: {Object}
    * `validator`: {Function}: (abs|base_source_url, abs|base_source_path, original_source_url, original_source_path) => boolean
        * check if font/image url in html matches to source file's basename
        * default to comparing both paths' basenames
    * `sourceTypes`: {Array{string}}
        * allowed source types
        * default to `all font/image types`
* Returns: {result | Error}
```js
const result = base64Injector.injectBase64.fromHTML('./images', '...<body><img src="apple.png"...</body>')
// => { modified: false, content: '...', nFont: 0, nImage: 0 }
```

## SCOPE
* You can simply limit the scope of source types in a sub-context.
    * It is useful when passing a directory path as the source.
* All possible font types are ['.svg', '.ttf', '.otf', '.eot', '.sfnt', '.woff2', '.woff']
* All possible image types are ['.apng', '.bmp', '.gif', '.ico', '.cur', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.tif', '.tiff', '.webp']

### base64Injector
* default to all font types + all image types
```js
await base64Injector.encodeToDataUrl(...)
```

### base64Injector.font
* default to all font types
```js
await base64Injector.font.encodeToDataSrc(...)
```

### base64Injector.image
* default to all image types
```js
await base64Injector.image.injectBase64(...)
```

### [MIT Licensed](LICENSE)