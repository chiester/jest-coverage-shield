'use strict';

const fs = require('fs');
const XMLSplitter = require('xml-splitter');

module.exports = report => {
  const metrics = report.project.metrics;

  const parsed = {
    methods: parseInt(metrics.methods, 10),
    statements: parseInt(metrics.statements, 10),
    conditionals: parseInt(metrics.conditionals, 10),
    coveredmethods: parseInt(metrics.coveredmethods, 10),
    coveredstatements: parseInt(metrics.coveredstatements, 10),
    coveredconditionals: parseInt(metrics.coveredconditionals, 10)
  };

  const {
    methods,
    statements,
    conditionals,
    coveredmethods,
    coveredstatements,
    coveredconditionals
  } = parsed;

  const functionRate = methods ? coveredmethods / methods : 1;
  const lineRate = statements ? coveredstatements / statements : 1;
  const branchRate = conditionals ? coveredconditionals / conditionals : 1;

  const percent = Math.floor((functionRate + lineRate + branchRate) / 3 * 100);

  return {
    overallPercent: percent,
    functionRate: functionRate,
    lineRate: lineRate,
    branchRate: branchRate
  };
};
