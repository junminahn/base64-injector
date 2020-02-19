'use strict';

const fs = require('fs');
const path = require('path');

const {
  isBuffer,
  eachArray,
  promiseMap,
  readFileAsync,
  writeFileAsync,
  readAllFilesAsync,
  readAllFilesSync,
} = require('./helpers');

const {
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
} = require('./core');

const { fontTypes, imageTypes, allSourceTypes, allTargetTypes } = meta;

const _defaultValidator = (path1, path2) => path1 === path2;

const createScope = ({ _sourceTypes, _targetTypes, _font, _image }) => {
  const injectBase64 = async (
    sourcePath,
    targetPath,
    {
      validator = _defaultValidator,
      sourceTypes = allSourceTypes,
      targetTypes = allTargetTypes,
      resave = true,
      fullpathMatch = false,
    } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const allowedTargetTypes = _targetTypes.filter(type => targetTypes.includes(type));

    const dataInfoMap = await _generateDataInfoMap(sourcePath, allowedSourceTypes);
    const result = { n: 0, nModified: 0, contents: [] };

    try {
      await promiseMap(await readAllFilesAsync(targetPath, allowedTargetTypes), async tpath => {
        const content = await readFileAsync(tpath, 'utf8');
        const parser = path.extname(tpath) === '.html' ? _updateHTMLContent : _updateCSSContent;

        const res = parser(content, validator, dataInfoMap, fullpathMatch, path.parse(tpath).dir, _font, _image);

        if (res.modified && resave) {
          await writeFileAsync(tpath, res.content, 'utf8');
        }

        res.filepath = tpath;

        result.n++;
        if (res.modified) result.nModified++;
        result.contents.push(res);
      });
    } catch (err) {
      console.error(err);
    }

    return resave ? true : result;
  };

  const injectBase64Sync = (
    sourcePath,
    targetPath,
    {
      validator = _defaultValidator,
      sourceTypes = allSourceTypes,
      targetTypes = allTargetTypes,
      resave = true,
      fullpathMatch = false,
    } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const allowedTargetTypes = _targetTypes.filter(type => targetTypes.includes(type));

    const dataInfoMap = _generateDataInfoMapSync(sourcePath, allowedSourceTypes);
    const result = { n: 0, nModified: 0, contents: [] };

    try {
      eachArray(readAllFilesSync(targetPath, allowedTargetTypes), tpath => {
        const content = fs.readFileSync(tpath, 'utf8');
        const parser = path.extname(tpath) === '.html' ? _updateHTMLContent : _updateCSSContent;

        const res = parser(content, validator, dataInfoMap, fullpathMatch, path.parse(tpath).dir, _font, _image);

        if (res.modified && resave) {
          fs.writeFileSync(tpath, res.content, 'utf8');
        }

        res.filepath = tpath;

        result.n++;
        if (res.modified) result.nModified++;
        result.contents.push(res);
      });
    } catch (err) {
      console.error(err);
    }

    return resave ? true : result;
  };

  injectBase64.fromCSS = async (
    sourcePath,
    css,
    { validator = _defaultValidator, sourceTypes = allSourceTypes, fullpathMatch = false, cssPath } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const dataInfoMap = await _generateDataInfoMap(sourcePath, allowedSourceTypes);
    const content = isBuffer(css) ? css.toString('utf8') : css;
    return _updateCSSContent(content, validator, dataInfoMap, fullpathMatch, cssPath, _font, _image);
  };

  injectBase64Sync.fromCSS = (
    sourcePath,
    css,
    { validator = _defaultValidator, sourceTypes = allSourceTypes, fullpathMatch = false, cssPath } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const dataInfoMap = _generateDataInfoMapSync(sourcePath, allowedSourceTypes);
    const content = isBuffer(css) ? css.toString('utf8') : css;
    return _updateCSSContent(content, validator, dataInfoMap, fullpathMatch, cssPath, _font, _image);
  };

  injectBase64.fromHTML = async (
    sourcePath,
    html,
    { validator = _defaultValidator, sourceTypes = allSourceTypes, fullpathMatch = false, htmlPath } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const dataInfoMap = await _generateDataInfoMap(sourcePath, allowedSourceTypes);
    const content = isBuffer(html) ? html.toString('utf8') : html;
    return _updateHTMLContent(content, validator, dataInfoMap, fullpathMatch, htmlPath, _font, _image);
  };

  injectBase64Sync.fromHTML = (
    sourcePath,
    html,
    { validator = _defaultValidator, sourceTypes = allSourceTypes, fullpathMatch = false, htmlPath } = {}
  ) => {
    const allowedSourceTypes = _sourceTypes.filter(type => sourceTypes.includes(type));
    const dataInfoMap = _generateDataInfoMapSync(sourcePath, allowedSourceTypes);
    const content = isBuffer(html) ? html.toString('utf8') : html;
    return _updateHTMLContent(content, validator, dataInfoMap, fullpathMatch, htmlPath, _font, _image);
  };

  return {
    encodeToDataUrl,
    encodeToDataUrlSync,
    encodeToDataSrc,
    encodeToDataSrcSync,
    encodeToFontDataSrc,
    encodeToFontDataSrcSync,
    injectBase64,
    injectBase64Sync,
  };
};

const main = createScope({ _sourceTypes: allSourceTypes, _targetTypes: allTargetTypes, _font: true, _image: true });
main.font = createScope({ _sourceTypes: fontTypes, _targetTypes: allTargetTypes, _font: true, _image: false });
main.image = createScope({ _sourceTypes: imageTypes, _targetTypes: allTargetTypes, _font: false, _image: true });

module.exports = main;
