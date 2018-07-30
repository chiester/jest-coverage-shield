'use strict';

const xmlFileToJson = require('./xmlFileToJson');
const saveFile = require('./saveFile');
const fs = require('fs');
const getColor = require('./getColor');
const path = require('path');

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const recursivelyUpdatePercentNodes = (node, percent) => {
  if (node.childNodes)
    node.childNodes.forEach(n => recursivelyUpdatePercentNodes(n, percent));
  if (node.constructor.name === 'TextNode' && node.data.indexOf('%') > 0) {
    node.data = `${percent}%`;
  }
};

module.exports = opts => report => {
  const badgeFilePath = path.resolve(process.cwd(), opts.badgeFileName);
  const newPercent = report.overallPercent;
  const isPerfect = newPercent === 100;

  // Special case
  if (isPerfect) {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../lib/templates/perfect.svg')
    );
    saveFile(badgeFilePath)(file, '100');
    return;
  }

  // Else get the right color
  const color = getColor(opts, newPercent);
  const file = fs.readFileSync(
    path.resolve(__dirname, `../lib/templates/${color}.svg`)
  );
  const svgAsString = file.toString();

  // HACK - pretty dangerous but it should be ok
  const newSvg = svgAsString.replaceAll(`>00%<`, `>${newPercent}%<`);

  // Save file
  saveFile(badgeFilePath)(newSvg, newPercent);
};
