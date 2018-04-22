class SearchList {
  constructor() {
    this.loggingModules = ['bunyan', 'log4js', 'morgan', 'winston'];
    this.httpFrameWorks = [
      'angular',
      'connect',
      'express',
      'hapi',
      'koa',
      'meteor',
      'react',
      'redux',
      'sails'
    ];
    this.testFrameworks = [
      'chai',
      'espresso',
      'jasmine-core',
      'jasmine-node',
      'jest',
      'jsunit',
      'mocha',
      'nodeunit',
      'should',
      'vows'
    ];
    this.cms = ['apostrophe'];
    this.daemonRunners = ['forever', 'nodemon', 'pm2', 'supervisor'];
    this.taskRunners = ['ant', 'grunt', 'gulp'];
    this.templateEngines = ['ejs', 'handlebars', 'jade', 'pug', 'swig'];
    this.harmony = ['harmony', 'node-harmony'];
    this.transpilers = [
      'babel',
      'coffeescript',
      'coffee-script',
      'typescript',
      'standard'
    ];
    this.databases = [
      'marsdb',
      'mongodb',
      'mongoose',
      'mysql',
      'redis',
      'sequelize',
      'sqlite'
    ];
    this.miscModules = [
      'async',
      'axios',
      'bluebird',
      'chalk',
      'cheerio',
      'commander',
      'joi',
      'jquery',
      'lodash',
      'moment',
      'multer',
      'notevil',
      'nyc',
      'passport',
      'request',
      'rxjs',
      'through2',
      'underscore',
      'webpack',
      'yargs',
      'loopback'
    ];
    this.all_sections = {
      'HTTP Frameworks': this.httpFrameWorks,
      CMS: this.cms,
      'Testing Frameworks': this.testFrameworks,
      'Daemon Runners': this.daemonRunners,
      'Task Runners': this.taskRunners,
      'Template Engines': this.templateEngines,
      Logging: this.loggingModules,
      Transpilers: this.transpilers,
      'ES6 Harmony': this.harmony,
      Databases: this.databases,
      Misc: this.miscModules
    };
  }
}

module.exports = {
  SearchList
};
