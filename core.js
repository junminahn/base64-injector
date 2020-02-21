'use strict';

const fs = require('fs');
const path = require('path');
const FileType = require('file-type');
const css = require('css');
const cheerio = require('cheerio');

let sync;
try {
  sync = require('promise-synchronizer');
} catch (er) {
  sync = null;
}

const {
  isArray,
  each,
  eachArray,
  promiseMap,
  readFileAsync,
  readAllFilesAsync,
  readAllFilesSync,
} = require('./helpers');

const { fontTypes, fontMap } = require('./font-meta');
const { imageTypes, imageMap } = require('./image-meta');

const CSS_TYPE = '.css';
const HTML_TYPE = '.html';
const typeMap = { ...imageMap, ...fontMap };
const allTargetTypes = [CSS_TYPE, HTML_TYPE];
const allSourceTypes = [...fontTypes, ...imageTypes];

const meta = {
  fontMap,
  imageMap,
  typeMap,
  fontTypes,
  imageTypes,
  allSourceTypes,
  allTargetTypes,
};

const MAX_PATH_LENGTH = 200;

const _buffToBase64 = buff => buff.toString('base64');
const _toDataUrl = (mediaType, base64) => `data:${mediaType};base64,${base64}`;
const _toDataSrc = (mediaType, base64) => `url(${_toDataUrl(mediaType, base64)})`;
const _toFontDataSrc = (mediaType, base64, format) => `${_toDataSrc(mediaType, base64)} format('${format}')`;

const _getMeta = (fpath, ext, allowedTypes = allSourceTypes) => {
  const naive = path.parse(fpath).ext;

  // https://www.npmjs.com/package/file-type#supported-file-types
  if (naive === '.svg' && allowedTypes.includes(naive)) {
    return typeMap[naive];
  }

  const type = (ext && `.${ext}`) || naive;

  if (!allowedTypes.includes(type)) return null;
  return typeMap[type];
};

const _createDataUrl = (fpath, { ext, mime, buff }, allowedTypes) => {
  const meta = _getMeta(fpath, ext, allowedTypes);
  if (!meta) return null;

  const mediaType = meta.mediaType;
  const base64 = _buffToBase64(buff);
  return _toDataUrl(mediaType, base64);
};

const _createDataSrc = (fpath, { ext, mime, buff }, allowedTypes) => {
  const meta = _getMeta(fpath, ext, allowedTypes);
  if (!meta) return null;

  const mediaType = meta.mediaType;
  const base64 = _buffToBase64(buff);
  return _toDataSrc(mediaType, base64);
};

const _createFontDataSrc = (fpath, { ext, mime, buff }, allowedTypes) => {
  const meta = _getMeta(fpath, ext, allowedTypes);
  if (!meta) return null;

  const mediaType = meta.mediaType;
  const format = meta.format;
  const base64 = _buffToBase64(buff);
  return _toFontDataSrc(mediaType, base64, format);
};

const _createDataInfo = (fpath, { ext, mime, buff }, allowedTypes) => {
  const meta = _getMeta(fpath, ext, allowedTypes);
  if (!meta) return {};

  const base64 = _buffToBase64(buff);
  return { meta, base64 };
};

const _readBuffer = async buff => {
  const data = await FileType.fromBuffer(buff);
  data.buff = buff;
  return data;
};

const _readBufferSync = buff => {
  let data;
  if (sync) {
    data = sync(FileType.fromBuffer(buff));
  } else {
    data = {};
  }
  data.buff = buff;
  return data;
};

const _encodeToDataUrl = async (fpath, allowedTypes) => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return _createDataUrl(fpath, data, allowedTypes);
};

const _encodeToDataUrlSync = (fpath, allowedTypes) => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return _createDataUrl(fpath, data, allowedTypes);
};

const _encodeToDataSrc = async (fpath, allowedTypes) => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return _createDataSrc(fpath, data, allowedTypes);
};

const _encodeToDataSrcSync = (fpath, allowedTypes) => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return _createDataSrc(fpath, data, allowedTypes);
};

const _encodeToFontDataSrc = async (fpath, allowedTypes) => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return _createFontDataSrc(fpath, data, allowedTypes);
};

const _encodeToFontDataSrcSync = (fpath, allowedTypes) => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return _createFontDataSrc(fpath, data, allowedTypes);
};

const _encodeToDataInfo = async (fpath, allowedTypes) => {
  const buff = await readFileAsync(fpath);
  const data = await _readBuffer(buff);
  return _createDataInfo(fpath, data, allowedTypes);
};

const _encodeToDataInfoSync = (fpath, allowedTypes) => {
  const buff = fs.readFileSync(fpath);
  const data = _readBufferSync(buff);
  return _createDataInfo(fpath, data, allowedTypes);
};

const encodeToDataUrl = async (fpath, allowedTypes) => {
  if (isArray(fpath)) return Promise.all(fpath.map(f => _encodeToDataUrl(f, allowedTypes)));
  return _encodeToDataUrl(fpath, allowedTypes);
};

const encodeToDataUrlSync = (fpath, allowedTypes) => {
  if (isArray(fpath)) return fpath.map(f => _encodeToDataUrlSync(f, allowedTypes));
  return _encodeToDataUrlSync(fpath, allowedTypes);
};

const encodeToDataSrc = (fpath, allowedTypes) => {
  if (isArray(fpath)) return Promise.all(fpath.map(f => _encodeToDataSrcSync(f, allowedTypes)));
  return _encodeToDataSrc(fpath, allowedTypes);
};

const encodeToDataSrcSync = (fpath, allowedTypes) => {
  if (isArray(fpath)) return fpath.map(f => _encodeToDataSrcSync(f, allowedTypes));
  return _encodeToDataSrcSync(fpath, allowedTypes);
};

const encodeToFontDataSrc = (fpath, allowedTypes) => {
  if (isArray(fpath)) return Promise.all(fpath.map(f => _encodeToFontDataSrcSync(f, allowedTypes)));
  return _encodeToFontDataSrc(fpath, allowedTypes);
};

const encodeToFontDataSrcSync = (fpath, allowedTypes) => {
  if (isArray(fpath)) return fpath.map(f => _encodeToFontDataSrcSync(f, allowedTypes));
  return _encodeToFontDataSrcSync(fpath, allowedTypes);
};

const _extractSrcUrl = value => {
  const rx = /url\('?(.+?)(\??#.+?)?'?\)/g;
  const arr = rx.exec(value);
  if (!arr) return value;
  return arr[1];
};

const _updateCSSContent = (content, validator, dataInfoMap, fullpathMatch, cssPath, _font, _image) => {
  const keys = Object.keys(dataInfoMap);
  const ast = css.parse(content);

  const result = { modified: false, nFont: 0, nImage: 0, type: '.css', parser: ast };

  each(ast.stylesheet.rules, rule => {
    if (_font && rule.type === 'font-face') {
      each(rule.declarations, dec => {
        if (dec.property === 'src') {
          const urls = dec.value.split(',');

          const nUrls = urls.map(url => {
            let nUrl = url;

            const urlpath = _extractSrcUrl(url);
            if (urlpath.length > MAX_PATH_LENGTH) return nUrl;

            const fullmatch = fullpathMatch && cssPath;

            const tpathToCompare = (fullmatch && path.resolve(cssPath, urlpath)) || path.basename(urlpath);

            each(keys, key => {
              const kpathToCompare = (fullmatch && path.resolve(key)) || path.basename(key);

              if (validator(tpathToCompare, kpathToCompare, urlpath, key)) {
                const {
                  meta: { mediaType, format },
                  base64,
                } = dataInfoMap[key];
                nUrl = _toFontDataSrc(mediaType, base64, format);
                result.modified = true;
                result.nFont++;
                return false;
              }
            });
            return nUrl;
          });
          dec.value = nUrls.join(',\n');
        }
      });
    } else if (_image) {
      if (rule.type === 'rule') {
        each(rule.declarations, dec => {
          if (dec.property === 'background') {
            const props = dec.value.split(' ');

            const nProps = props.map(prop => {
              let nProp = prop;

              const urlpath = _extractSrcUrl(prop);
              if (urlpath.length === 0 && urlpath.length > MAX_PATH_LENGTH) return nProp;

              const fullmatch = fullpathMatch && cssPath;

              const tpathToCompare = (fullmatch && path.resolve(cssPath, urlpath)) || path.basename(urlpath);

              each(keys, key => {
                const kpathToCompare = (fullmatch && path.resolve(key)) || path.basename(key);
                if (validator(tpathToCompare, kpathToCompare, urlpath, key)) {
                  const {
                    meta: { mediaType },
                    base64,
                  } = dataInfoMap[key];
                  nProp = _toDataSrc(mediaType, base64);
                  result.modified = true;
                  result.nImage++;
                  return false;
                }
              });
              return nProp;
            });
            dec.value = nProps.join(' ');
          } else if (dec.property === 'background-image') {
            let nProp = dec.value;
            const urlpath = _extractSrcUrl(nProp);

            if (urlpath.length === 0 && urlpath.length > MAX_PATH_LENGTH) return nProp;

            const fullmatch = fullpathMatch && cssPath;

            const tpathToCompare = (fullmatch && path.resolve(cssPath, urlpath)) || path.basename(urlpath);

            each(keys, key => {
              const kpathToCompare = (fullmatch && path.resolve(key)) || path.basename(key);
              if (validator(tpathToCompare, kpathToCompare, urlpath, key)) {
                const {
                  meta: { mediaType },
                  base64,
                } = dataInfoMap[key];
                nProp = _toDataSrc(mediaType, base64);
                result.modified = true;
                result.nImage++;
                return false;
              }
            });
            dec.value = nProp;
          }
        });
      }
    }
  });

  if (result.modified) {
    const newContent = css.stringify(ast);
    result.content = newContent;
  } else {
    result.content = content;
  }

  return result;
};

const _updateHTMLContent = (content, validator, dataInfoMap, fullpathMatch, cssPath, _font, _image) => {
  const keys = Object.keys(dataInfoMap);
  const $ = cheerio.load(content);

  const result = { modified: false, nFont: 0, nImage: 0, type: '.html', parser: $ };

  $('img').each(function(i, elem) {
    const _this = $(this);
    const src = _this.attr('src');

    let newSrc = src;

    if (src.length > MAX_PATH_LENGTH) return newSrc;

    const fullmatch = fullpathMatch && cssPath;

    const tpathToCompare = (fullmatch && path.resolve(cssPath, src)) || path.basename(src);

    each(keys, key => {
      const kpathToCompare = (fullmatch && path.resolve(key)) || path.basename(key);

      if (validator(tpathToCompare, kpathToCompare, src, key, _this)) {
        const {
          meta: { mediaType },
          base64,
        } = dataInfoMap[key];
        newSrc = _toDataUrl(mediaType, base64);
        result.modified = true;
        result.nImage++;
        return false;
      }
    });

    _this.attr('src', newSrc);
  });

  if (result.modified) {
    const newContent = $.html();
    result.content = newContent;
  } else {
    result.content = content;
  }

  return result;
};

const _generateDataInfoMap = async (fpath, sourceTypes) => {
  const dataInfoMap = {};

  try {
    await promiseMap(await readAllFilesAsync(fpath, sourceTypes), async fp => {
      dataInfoMap[fp] = await _encodeToDataInfo(fp, sourceTypes);
    });
  } catch (e) {
    console.error(e);
  }

  return dataInfoMap;
};

const _generateDataInfoMapSync = (sourcePath, sourceTypes) => {
  const dataInfoMap = {};

  eachArray(readAllFilesSync(sourcePath, sourceTypes), spath => {
    dataInfoMap[spath] = _encodeToDataInfoSync(spath, sourceTypes);
  });

  return dataInfoMap;
};

module.exports = {
  meta,
  encodeToDataUrl,
  encodeToDataUrlSync,
  encodeToDataSrc,
  encodeToDataSrcSync,
  encodeToFontDataSrc,
  encodeToFontDataSrcSync,
  _updateCSSContent,
  _updateHTMLContent,
  _generateDataInfoMap,
  _generateDataInfoMapSync,
};
