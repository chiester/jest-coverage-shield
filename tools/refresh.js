'use strict';

const program = require('commander');
const pkgJson = require('../package');
const https = require('https');
const http = require('http');
const saveFile = require('./saveFile');
const path = require('path');

program
  .description('Development use to make templates')
  .version(pkgJson.version)
  .option('-s, --shieldStyle <shieldStyle>', 'Shield style', 'flat-square')
  .option(
    '-F, --format <type>',
    'Format of the generated badge. (SVG by default)',
    'svg'
  )
  .parse(process.argv);

const makeTemplate = (color, percent) => {
  return `https://img.shields.io/badge/coverage-${percent}%25-${color}.${
    program.format
  }?style=${program.shieldStyle}`;
};

const downloadUrl = url =>
  new Promise((resolve, reject) => {
    const httpClient = url.indexOf('https://') === 0 ? https : http;

    const req = httpClient.get(url, res => {
      if (res.statusCode === 404) reject(res.statusCode);

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
  });

// Make all the templates
// Perfect is 3 digits long svg is different
const perfect = makeTemplate('brightgreen', '100');
const excellent = makeTemplate('brightgreen', '00');
const good = makeTemplate('yellow', '00');
const bad = makeTemplate('red', '00');

// Download all
return Promise.all([
  downloadUrl(perfect).then(
    saveFile(path.resolve('./lib/templates/perfect.svg'))
  ),
  downloadUrl(excellent).then(
    saveFile(path.resolve('./lib/templates/brightgreen.svg'))
  ),
  downloadUrl(good).then(saveFile(path.resolve('./lib/templates/yellow.svg'))),
  downloadUrl(bad).then(saveFile(path.resolve('./lib/templates/red.svg')))
]);
