'use strict';

const Svg = require('svgutils').Svg;
const _ = require('lodash');
const xmlFileToJson = require('./xmlFileToJson');
const saveFile = require('./saveFile');
const createBadgeUrl = require('./createBadgeUrl');
const download = require('./downloader');
const decode = require('decode-html');
const fs = require('fs');

const isSameLength = (x, y) => String(x).length === String(y).length;

const isSameColor = opts => (x, y) => {
  const getColor = p =>
    p >= opts.thresholds.excellent
      ? 'brightgreen'
      : p >= opts.thresholds.good ? 'yellow' : 'red';
  return getColor(x) === getColor(y);
};

module.exports = opts => report => {
  // Very crude method to update percentage
  const file = fs.readFileSync(opts.badgeFileName);
  const svgAsString = file.toString();
  const indexOfP = svgAsString.indexOf('%');
  // Try to find the percentage
  const newPercent = report.overallPercent;

  let oldPercent;
  for (let x = 1; x > 0; x++) {
    const tryIndex = indexOfP - x;
    const num = svgAsString.substring(tryIndex, indexOfP);
    const maybeNaN = parseInt(num, 10);
    // Stop if fail
    if (isNaN(maybeNaN)) break;
    // Else set new oldPercent
    oldPercent = num;
  }

  if (
    !isSameLength(oldPercent, newPercent) ||
    !isSameColor(oldPercent, newPercent)
  ) {
    // Grab a new svg sizing has changed
    const url = createBadgeUrl(opts)(report);
    download(url)
      .then(saveFile(opts.badgeFileName))
      .then(console.log)
      .then(() => {
        console.log(`Successfully created badge for ${newPercent}% coverage`);
      })
      .catch(console.error);
  } else {
    // HACK - pretty dangerous but it should be ok
    const newSvg = svgAsString.replace(`>${oldPercent}%<`, `>${newPercent}%<`);

    // Finally save the file
    fs.writeFile(
      `${process.cwd()}/${opts.badgeFileName}`,
      decode(newSvg),
      err => {
        if (err) throw err;
        console.log(`Successfully created badge for ${newPercent}% coverage`);
      }
    );
  }
};
