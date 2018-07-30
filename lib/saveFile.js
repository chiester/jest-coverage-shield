'use strict';

const fs = require('fs');
const path = require('path');

// Creates directory and file
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

module.exports = saveAtPath => (buffer, newPercent) =>
  new Promise((resolve, reject) => {
    var dirToSave = path.dirname(saveAtPath);
    ensureDirectoryExistence(saveAtPath);
    fs.writeFile(saveAtPath, buffer, err => {
      if (err) reject(err);
      if (newPercent) {
        console.log(`Successfully created badge for ${newPercent}% coverage`);
      } else {
        console.log(`Successfully created badge`);
      }
    });
  });
