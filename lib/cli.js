#!/usr/bin/env node
'use strict';

const path = require('path');
const program = require('commander');
const pkgJson = require('../package');
const cloverReportParser = require('./cloverReportParser');
const xmlFileToJson = require('./xmlFileToJson');
const updateBadge = require('./updateBadge');
const fs = require('fs');
const help = require('./_help');

const input = path.resolve('./coverage/clover.xml');
const output = path.resolve('./shields');

program
  .description('Generates a badge for a given Clover XML report. ')
  .version(pkgJson.version)
  .option(
    '-F, --format <type>',
    'Format of the generated badge. (SVG by default)',
    'svg'
  )
  .option(
    '-e, --excellentThreashold <n>',
    'The threshold for green badges, where coverage >= -e',
    90
  )
  .option(
    '-g, --goodThreashold <n>',
    'The threshold for yellow badges, where -g <= coverage < -e  ',
    65
  )
  .option(
    '-b, --badgeFileName <badge>',
    'The badge file name that will be saved.',
    'coverage'
  )
  .option('-r, --reportFile <report>', 'The Clover XML file path.', input)
  .option(
    '-d, --destinationDir <destination>',
    'The directory where coverage.svg will be generated at.',
    output
  )
  .option('-v, --verbose', 'Prints the metadata for the command')
  .parse(process.argv);

program.on('--help', help);

// The options to the badger API coming from the program.
const opts = {
  badgeFileName: path.join(
    program.destinationDir,
    program.badgeFileName + '.' + program.format
  ),
  destinationDir: path.resolve(program.destinationDir),
  reportFile: program.reportFile,
  thresholds: {
    excellent: program.excellentThreashold,
    good: program.goodThreashold
  }
};

// Update badge
xmlFileToJson(opts.reportFile)
  .then(cloverReportParser)
  .then(updateBadge(opts));
