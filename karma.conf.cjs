module.exports = config => config.set({
  frameworks: ['jasmine'],
  files: ['node_modules/angular/angular.js', 'node_modules/angular-mocks/angular-mocks.js', 'src/**/*.js', 'Test/quality-gate-generated-*.spec.js'],
  preprocessors: { 'src/**/*.js': ['coverage'] },
  reporters: ['progress', 'coverage', 'junit'],
  coverageReporter: { dir: '.quality-gate-metrics/angularjs', subdir: '.', reporters: [{ type: 'json-summary' }] },
  junitReporter: { outputDir: '.quality-gate-metrics/angularjs', outputFile: 'test-results.xml', useBrowserName: false },
  browsers: ['ChromeHeadless'], singleRun: true
});
