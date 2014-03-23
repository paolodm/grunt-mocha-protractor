/*
 * grunt-mocha-protractor
 * https://github.com/noblesamurai/grunt-mocha-protractor
 */

'use strict';

var protractor = require('protractor'),
    runner = require('../lib/runner'),
    reporter = require('../lib/reporter'),
    async = require('async');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaProtractor', 'Run e2e angular tests with webdriver.', function() {
    var files = this.files,
        options = this.options({
          browsers: ['Chrome'],
          reporter: 'Spec',
          args: null,
          seleniumUrl: 'http://localhost:4444/wd/hub',

          // saucelabs options
          sauceUsername: process.env.SAUCE_USERNAME,
          sauceAccessKey: process.env.SAUCE_ACCESS_KEY,

          // protractor config
          baseUrl: '',
          rootElement: '',
          params: {}
        }),
        asyncTasks = [];

    // wrap reporter
    options.reporter = reporter(options.reporter);

    grunt.util.async.forEachSeries(options.browsers, function(browser, next) {
      grunt.util.async.forEachSeries(files, function(fileGroup, next) {
        asyncTasks.push(function() {
          console.log();
          runner(grunt, fileGroup, browser, options, next);
        });
      }, next);
    }, this.async());

    async.parallel(asyncTasks);
  });
};
