#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js').Section;
const colors = require('./colors');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const program = require('commander');

class NodeDvnr {
  constructor(pkg, workingDir) {
    this.logFileName = this.determineFileName(pkg);
    this.workingDirectory = workingDir;
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

  searchDependencies(
    dependencies,
    devDependencies,
    nodeModulesList,
    logFileName,
    workingDir
  ) {
    for (let sectionTitle in this.all_sections) {
      this.printSection(
        sectionTitle,
        dependencies,
        devDependencies,
        this.to_regex_map(this.all_sections[sectionTitle]),
        nodeModulesList,
        logFileName,
        workingDir
      );
    }
  }

  determineFileName(pkg) {
    return _.get(pkg, 'name', 'default');
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  printSystemInfo(logFileName) {
    const sysInfo = new Section('General Info', logFileName);

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

    const cpuInfo = new Section('cpu', logFileName);
    cpuInfo.addData('model', cpuModel);
    cpuInfo.addData('cores', cpuCores);
    cpuInfo.addData('speed', cpuSpeed);
    sysInfo.addData(cpuInfo);

    if (env) {
      sysInfo.addData('env', env);
    }

    sysInfo.print();
  }

  printSection(
    sectionTitle,
    dependencies,
    devDependencies,
    search_map,
    nodeModuleList,
    logFileName,
    workingDir
  ) {
    const section = new Section(sectionTitle, logFileName);

    let seen = [];

    [dependencies, devDependencies].forEach(dependency => {
      search_map.forEach(frameworkRegExp => {
        _.forIn(dependency, (value, key) => {
          if (key.search(frameworkRegExp) !== -1) {
            let moduleName = this.capitalizeFirstLetter(key);
            if (!seen.includes(moduleName)) {
              section.addData(this.capitalizeFirstLetter(moduleName), value);
              let path = this.getModulePath(workingDir, moduleName);
              this.findModuleDeps(section, moduleName, path);
              seen.push(moduleName.toLowerCase());
            }
          }
        });
        _.forIn(nodeModuleList, key => {
          if (key.search(frameworkRegExp) !== -1) {
            let moduleName = this.capitalizeFirstLetter(key);
            if (!seen.includes(moduleName)) {
              section.addData(moduleName, '(Found in /node_modules)');
            }
          }
        });
      });
    });

    section.print();
  }

  getModulePath(workingDirectory, moduleName) {
    return path.resolve(
      workingDirectory,
      '/node_modules',
      moduleName.toLowerCase()
    );
  }

  findModuleDeps(section, module, path, logFileName) {
    try {
      let depsSection = new Section(`${module} Deps`, logFileName);
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
          depsSection.addData(this.capitalizeFirstLetter(key), value);
        });

        _.forIn(devDependencies, (value, key) => {
          depsSection.addData(this.capitalizeFirstLetter(key), value);
        });

        section.addData(depsSection);
      }
    } catch (e) {
      // do nothing if we can't find the deps
    }
  }

  printBanner() {
    const reportDate = new Date().toString();
    console.log(
      colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)')
    );
    console.log(reportDate);
    console.log();
  }

  to_regex_map(strings) {
    return strings.map(s => new RegExp(`${s}`, 'i'));
  }

  printAddons(LogFileName) {
    const section = new Section('Custom Addons (C++/V8)', LogFileName);
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

  printNpmScripts(pkg, logFileName) {
    let npmScriptsSection = new Section('Package.json Scripts', logFileName);
    let scripts = _.get(pkg, 'scripts', null);

    if (scripts != null) {
      _.forIn(scripts, (value, key) => {
        npmScriptsSection.addData(key, value);
      });
    }

    npmScriptsSection.print();
  }
}

function getNodeModulesDirNames(workDir) {
  let nodeModulesPath = path.join(workDir + '/node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    let modulesNames = [];
    fs.readdirSync(nodeModulesPath).forEach(file => {
      modulesNames.push(file);
    });
    return modulesNames;
  }
  return [];
}

function main(inputPath) {
  let pkg;
  let workingDirectory;

  if (inputPath != null) {
    let relativePath = path.normalize(
      path.relative(process.env.PWD, inputPath)
    );
    workingDirectory = path.resolve(process.env.PWD, relativePath);
  } else {
    workingDirectory = process.env.PWD;
  }

  try {
    pkg = require(workingDirectory + '/package.json');
  } catch (e) {
    console.log(
      `Could not read package.json. To fully check compatibility, make sure to run nvnr with the same directory as your application's package.json.\n` +
        `Searched for package.json in ${workingDirectory}`
    );
  }

  if (pkg) {
    let nodeModuleList = getNodeModulesDirNames(workingDirectory);
    let Dvnr = new NodeDvnr(pkg, workingDirectory);
    let logFileName = Dvnr.logFileName;
    console.log(logFileName);

    Dvnr.printBanner();
    Dvnr.printSystemInfo(logFileName);

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

    Dvnr.printNpmScripts(pkg, logFileName);

    Dvnr.searchDependencies(
      dependencies,
      devDependencies,
      nodeModuleList,
      logFileName,
      workingDirectory
    );
    Dvnr.printAddons(logFileName);

    if (fs.existsSync(`nvnr-${logFileName}.txt`)) {
      console.log(
        `\nWrote Compatibility Report to nvnr-${logFileName}.txt to ${workingDirectory}`
      );
    }
  }
}

program
  .version('1.0.0')
  .usage(
    '[options] <path> -- path is optional. Without path option will run in current directory.'
  )
  .option('-p', '--path', "Path to project's root directory with package.json")
  .action((dir, cmd) => {
    main(dir);
  })
  .parse(process.argv);

if (process.argv.length < 3) {
  main(null);
}
