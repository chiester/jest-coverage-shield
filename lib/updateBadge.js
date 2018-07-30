'use strict';

const _ = require('lodash');
const xmlFileToJson = require('./xmlFileToJson');
const saveFile = require('./saveFile');
const createBadgeUrl = require('./createBadgeUrl');
const download = require('./downloader');
const fs = require('fs');
const decode = require('decode-html');
const window = require('svgdom');
const SVG = require('svg.js')(window);
const document = window.document;
const getColor = require('./getColor');

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const isSameLength = (x, y) => String(x).length === String(y).length;

const findOldPercent = node => {
  let anyPercent;

  if (node.childNodes) {
    for (let x = 0; x < node.childNodes.length; x++) {
      const childNode = node.childNodes[x];
      // Only look at TextNodes
      if (!childNode.constructor.name === 'TextNode') return;

      const p = findOldPercent(node.childNodes[x]);

      // Already found shortcut exit
      if (!isNaN(p)) return p;

      if (p && p.indexOf('%') > 0) {
        const trimmed = p.replace('%', '');
        anyPercent = parseInt(trimmed, 10);
        break;
      }
    }
  }

  return parseInt(anyPercent || node.data, 10);
};

const recursivelyUpdatePercentNodes = (node, percent) => {
  if (node.childNodes)
    node.childNodes.forEach(n => recursivelyUpdatePercentNodes(n, percent));
  if (node.constructor.name === 'TextNode' && node.data.indexOf('%') > 0) {
    node.data = `${percent}%`;
  }
};

module.exports = opts => report => {
  // Local helper
  const isSameColor = (x, y) => getColor(opts, x) === getColor(opts, y);

  // Very crude method to update percentage
  const badgeFilePath = `${process.cwd()}/${opts.badgeFileName}`;
  const file = fs.readFileSync(badgeFilePath);
  const svgAsString = file.toString();
  const indexOfP = svgAsString.indexOf('%');
  // Try to find the percentage
  const newPercent = report.overallPercent;

  // create svg.js instance
  const draw = SVG(document.documentElement);

  draw.svg(svgAsString);

  let oldPercent = findOldPercent(draw.node);

  if (
    !isSameLength(oldPercent, newPercent) ||
    !isSameColor(oldPercent, newPercent)
  ) {
    // Grab a new svg sizing has changed
    const url = createBadgeUrl(opts)(report);
    download(url)
      .then(saveFile(badgeFilePath))
      .catch(console.error);
  } else {
    // HACK - pretty dangerous but it should be ok
    const newSvg = svgAsString.replaceAll(
      `>${oldPercent}%<`,
      `>${newPercent}%<`
    );

    saveFile(badgeFilePath)(newSvg, newPercent);
  }
};
