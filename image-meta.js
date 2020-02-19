'use strict';

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const imageMap = {
  '.apng': {
    mediaType: 'image/apng',
  },
  '.bmp': {
    mediaType: 'image/bmp',
  },
  '.gif': {
    mediaType: 'image/gif',
  },
  '.ico': {
    mediaType: 'image/x-icon',
  },
  '.cur': {
    mediaType: 'image/x-icon',
  },
  '.jpg': {
    mediaType: 'image/jpeg',
  },
  '.jpeg': {
    mediaType: 'image/jpeg',
  },
  '.jfif': {
    mediaType: 'image/jpeg',
  },
  '.pjpeg': {
    mediaType: 'image/jpeg',
  },
  '.pjp': {
    mediaType: 'image/jpeg',
  },
  '.png': {
    mediaType: 'image/png',
  },
  '.svg': {
    mediaType: 'image/svg+xml',
  },
  '.tif': {
    mediaType: 'image/tiff',
  },
  '.tiff': {
    mediaType: 'image/tiff',
  },
  '.webp': {
    mediaType: 'image/webp',
  },
};

module.exports = {
  imageTypes: Object.keys(imageMap),
  imageMap,
};
