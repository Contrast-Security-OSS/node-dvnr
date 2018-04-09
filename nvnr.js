#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js').Section;
const file_ts = require('./section.js').file_ts;
const colors = require('./colors');
const _ = require('lodash');
const fs = require('fs');
const GetInstallPath = require('get-installed-path');
const path = require('path');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const loggingModules = ['bunyan', 'log4js', 'morgan', 'winston'];

const httpFrameWorks = [
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

const testFrameworks = [
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

const cms = ['apostrophe'];

const daemonRunners = ['forever', 'nodemon', 'pm2', 'supervisor'];

const taskRunners = ['ant', 'grunt', 'gulp'];

const templateEngines = ['ejs', 'handlebars', 'jade', 'pug', 'swig'];

const harmony = ['harmony', 'node-harmony'];

const transpilers = [
  'babel',
  'coffeescript',
  'coffee-script',
  'typescript',
  'standard'
];

const databases = [
  'marsdb',
  'mongodb',
  'mongoose',
  'mysql',
  'redis',
  'sequelize',
  'sqlite'
];

const miscModules = [
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

const all_sections = {
  'HTTP Frameworks': httpFrameWorks,
  CMS: cms,
  'Testing Frameworks': testFrameworks,
  'Daemon Runners': daemonRunners,
  'Task Runners': taskRunners,
  'Template Engines': templateEngines,
  Logging: loggingModules,
  Transpilers: transpilers,
  'ES6 Harmony': harmony,
  Databases: databases,
  Misc: miscModules
};

function to_regex_map(strings) {
  return strings.map(s => new RegExp(`${s}`, 'i'));
}

function banner() {
  const reportDate = new Date().toString();
  console.log(colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)'));
  console.log(reportDate);
  console.log();
  console.log('**Common Modules List**');
}

function printSystemInfo() {
  const sysInfo = new Section('General Info');

  const platform = `${process.platform} ${os.release()}`;
  const arch = os.arch();
  const nodeVersion = process.version;
  const env = process.env.NODE_ENV;

  const totalmem = os.totalmem();
  const gig = Math.pow(2, 30);
  const totalgb = totalmem / gig;

  const cpus = os.cpus();
  const cpuCores = cpus.length;
  const cpuModel = cpuCores >= 1 ? cpus[0].model : 'unknown';
  const cpuSpeed = cpuCores >= 1 ? cpus[0].speed : 'unknown';

  sysInfo.addData('os', `${platform}, ${arch}`);
  sysInfo.addData('node', nodeVersion);
  sysInfo.addData('mem', totalgb);
  sysInfo.addData('cwd', process.env.PWD);

  const cpuInfo = new Section('cpu');
  cpuInfo.addData('model', cpuModel);
  cpuInfo.addData('cores', cpuCores);
  cpuInfo.addData('speed', cpuSpeed);
  sysInfo.addData(cpuInfo);

  if (env) {
    sysInfo.addData('env', env);
  }

  sysInfo.print();
}

function printSection(
  sectionTitle,
  dependencies,
  devDependencies,
  nodeModuleList,
  search_map
) {
  const section = new Section(sectionTitle);

  let seen = [];

  search_map.forEach(frameworkRegExp => {
    _.forIn(dependencies, (value, key) => {
      if (key.search(frameworkRegExp) !== -1) {
        let moduleName = capitalizeFirstLetter(key);
        section.addData(moduleName, value);
        let path = GetInstallPath.getInstalledPathSync(
          moduleName.toLowerCase(),
          {
            local: true
          }
        );
        findModuleDeps(section, moduleName, path);
        seen.push(moduleName);
      }
    });

    _.forIn(devDependencies, (value, key) => {
      if (key.search(frameworkRegExp) !== -1) {
        let moduleName = capitalizeFirstLetter(key);
        section.addData(moduleName, value);
        let path = GetInstallPath.getInstalledPathSync(
          moduleName.toLowerCase(),
          {
            local: true
          }
        );
        findModuleDeps(section, moduleName, path);
        seen.push(moduleName);
      }
    });

    _.forIn(nodeModuleList, key => {
      if (key.search(frameworkRegExp) !== -1) {
        let moduleName = capitalizeFirstLetter(key);
        if (!seen.includes(moduleName)) {
          section.addData(moduleName, '(Found in /node_modules)');
        }
      }
    });
  });

  section.print();
}

function findModuleDeps(section, module, path) {
  try {
    let depsSection = new Section(`${module} Deps`);
    let modulePkg = require(path + '/package.json');
    if (modulePkg) {
      let dependencies = _.get(
        modulePkg,
        'dependencies',
        _.get(modulePkg, 'Dependencies', '')
      );
      let devDependencies = _.get(
        modulePkg,
        'devDependencies',
        _.get(modulePkg, 'devdependencies', '')
      );

      _.forIn(dependencies, (value, key) => {
        depsSection.addData(capitalizeFirstLetter(key), value);
      });

      _.forIn(devDependencies, (value, key) => {
        depsSection.addData(capitalizeFirstLetter(key), value);
      });

      section.addData(depsSection);
    }
  } catch (e) {
    // do nothing if we can't find the deps
  }
}

function addons() {
  const section = new Section('Custom Addons (C++/V8)');
  try {
    let data = fs.readFileSync('binding.gyp');
    if (data != null) {
      section.addData('Binding.gyp', data.toString());
    }
  } catch (e) {
    // probably file not found...
  }

  section.print();
}

function getNodeModulesDirNames() {
  let nodeModulesPath = path.join(process.env.PWD, '/node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    let modulesNames = [];
    fs.readdirSync(nodeModulesPath).forEach(file => {
      modulesNames.push(file);
    });
    return modulesNames;
  }
  return [];
}

function main() {
  banner();
  printSystemInfo();
  var pkg;
  try {
    pkg = require(process.env.PWD + '/package.json');
  } catch (e) {
    console.log(
      "Could not read package.json. To fully check compatibility, make sure to run nvnr in the same directory as your application's package.json."
    );
  }

  if (pkg) {
    let dependencies = _.get(
      pkg,
      'dependencies',
      _.get(pkg, 'Dependencies', '')
    );
    let devDependencies = _.get(
      pkg,
      'devDependencies',
      _.get(pkg, 'devdependencies', '')
    );

    let nodeModuleList = getNodeModulesDirNames();

    for (let section in all_sections) {
      printSection(
        section,
        dependencies,
        devDependencies,
        nodeModuleList,
        to_regex_map(all_sections[section])
      );
    }
    addons();

    if (fs.existsSync(`nvnr-${file_ts}.txt`)) {
      console.log(`\nWrote nvnr-${file_ts}.txt to ${process.env.PWD}`);
    }
  }
}

main();
