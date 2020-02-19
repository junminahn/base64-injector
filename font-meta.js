'use strict';

/**
 * A data URI consists of data:[<media type>][;base64],<data>
 * https://en.wikipedia.org/wiki/Data_URI_scheme
 *
 * # Font formats
 * svg   = svn:mime-type=image/svg+xml
 * ttf   = svn:mime-type=application/x-font-ttf
 * otf   = svn:mime-type=application/x-font-opentype
 * woff  = svn:mime-type=application/font-woff
 * woff2 = svn:mime-type=application/font-woff2
 * eot   = svn:mime-type=application/vnd.ms-fontobject
 * sfnt  = svn:mime-type=application/font-sfnt
 */

const fontMap = {
  '.svg': {
    mediaType: 'image/svg+xml;charset=utf-8',
    format: 'svg',
  },
  '.ttf': {
    mediaType: 'font/truetype;charset=utf-8',
    format: 'truetype',
  },
  '.otf': {
    mediaType: 'font/opentype;charset=utf-8',
    format: 'opentype',
  },
  '.eot': {
    mediaType: 'application/vnd.ms-fontobject;charset=utf-8',
    format: 'embedded-opentype',
  },
  '.sfnt': {
    mediaType: 'application/font-sfnt;charset=utf-8',
    format: 'sfnt',
  },
  '.woff2': {
    mediaType: 'application/font-woff2;charset=utf-8',
    format: 'woff2',
  },
  '.woff': {
    mediaType: 'application/font-woff;charset=utf-8',
    format: 'woff',
  },
};

module.exports = {
  fontTypes: Object.keys(fontMap),
  fontMap,
};
