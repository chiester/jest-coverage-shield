'use strict';

const getColor = require('./getColor');

module.exports = opts => report => {
  const color = getColor(opts, report.overallPercent);
  return `https://img.shields.io/badge/coverage-${
    report.overallPercent
  }%25-${color}.${opts.badgeFormat}?style=${opts.shieldStyle}`;
};
