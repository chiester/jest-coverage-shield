module.exports = (opts, overallPercent) =>
  overallPercent >= opts.thresholds.excellent
    ? 'brightgreen'
    : overallPercent >= opts.thresholds.good ? 'yellow' : 'red';
