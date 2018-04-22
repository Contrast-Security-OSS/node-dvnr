#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js').Section;
const SearchList = require('./searchList').SearchList;
const colors = require('./colors');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const program = require('commander');

class NodeDvnr {
  constructor(pkg, workingDir) {
    this.logFileName = this.determineFileName(pkg);
    this.pkg = pkg;
    this.workingDirectory = workingDir;
    this.seen = [];
  }

  searchDependencies(dependencies, devDependencies, nodeModulesList) {
    const searchList = new SearchList();
    for (let sectionTitle in searchList.all_sections) {
      this.printSection(
        sectionTitle,
        dependencies,
        devDependencies,
        to_regex_map(searchList.all_sections[sectionTitle]),
        nodeModulesList
      );
    }
  }

  determineFileName(pkg) {
    return _.get(pkg, 'name', 'default');
  }

  printSystemInfo() {
    const sysInfo = new Section('General Info', this.logFileName);

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

    const cpuInfo = new Section('cpu', this.logFileName);
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
    nodeModuleList
  ) {
    const section = new Section(sectionTitle, this.logFileName);

    [dependencies, devDependencies].forEach(dependency => {
      search_map.forEach(frameworkRegExp => {
        _.forIn(dependency, (version, name) => {
          if (name.search(frameworkRegExp) !== -1) {
            let moduleName = name.toLowerCase();
            section.addData(capitalizeFirstLetter(moduleName), version);
            let moduleDepsSection = this.createModuleDepsSection(moduleName);
            if (moduleDepsSection != null) {
              section.addData(moduleDepsSection);
            }
          }
        });
        nodeModuleList.forEach(key => {
          if (key.search(frameworkRegExp) !== -1) {
            let moduleName = capitalizeFirstLetter(key.toLowerCase());
            section.addData(moduleName, '(Found in /node_modules)');
          }
        });
      });
    });
    section.print();
  }

  createModuleDepsSection(moduleName) {
    if (!this.workingDirectory || !moduleName) {
      return null;
    }
    let modulePath = this.getModulePath(moduleName);
    let moduleDeps = this.getModuleDeps(modulePath);
    return this.createDepsSection(moduleName, moduleDeps);
  }

  createDepsSection(moduleName, moduleDeps) {
    const moduleDepsSection = new Section(
      `↪ ${moduleName} Deps`,
      this.logFileName
    );
    _.forIn(moduleDeps, (moduleVersion, moduleName) => {
      moduleDepsSection.addData(
        capitalizeFirstLetter(moduleName),
        moduleVersion
      );
    });
    return moduleDepsSection;
  }

  getModulePath(moduleName) {
    return path.join(this.workingDirectory, '/node_modules', moduleName);
  }

  getModuleDeps(modulePath) {
    let pkgPath = path.resolve(modulePath, 'package.json');
    let modulePkg;
    try {
      modulePkg = require(pkgPath);
    } catch (e) {
      return null;
    }
    let allDeps = null;
    if (modulePkg) {
      let all_deps = getDependencies(modulePkg);
      let dependencies = all_deps[0];
      let devDependencies = all_deps[1];
      [dependencies, devDependencies].forEach(dependency => {
        _.forIn(dependency, (version, name) => {
          allDeps[name] = version;
        });
      });
    }
    return allDeps;
  }

  printAddons() {
    const section = new Section('Custom Addons (C++/V8)', this.logFileName);
    try {
      let path = path.resolve(this.workingDirectory, 'binding.gyp');
      let data = fs.readFileSync(path);
      if (data != null) {
        section.addData('Binding.gyp', data.toString());
      }
    } catch (e) {
      // probably file not found...
    }

    section.print();
  }

  printNpmScripts() {
    let npmScriptsSection = new Section(
      'Package.json Scripts',
      this.logFileName
    );
    let scripts = _.get(this.pkg, 'scripts', null);

    if (scripts != null) {
      _.forIn(scripts, (value, key) => {
        npmScriptsSection.addData(key, value);
      });
    }

    npmScriptsSection.print();
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNodeModulesDirNames(workDir) {
  let nodeModulesPath = path.join(workDir + '/node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    let modulesNames = [];
    fs.readdirSync(nodeModulesPath).forEach(file => {
      modulesNames.push(file);
    });
    return new Set(modulesNames);
  }
  return [];
}

function printBanner() {
  const reportDate = new Date().toString();
  console.log(colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)'));
  console.log(reportDate);
  console.log();
}
function to_regex_map(strings) {
  return strings.map(s => new RegExp(`${s}`, 'i'));
}

function getDependencies(pkg) {
  let dependencies = _.get(pkg, 'dependencies', _.get(pkg, 'Dependencies', ''));
  let devDependencies = _.get(
    pkg,
    'devDependencies',
    _.get(pkg, 'devdependencies', '')
  );
  return [dependencies, devDependencies];
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
    let pkgPath = path.resolve(workingDirectory, 'package.json');
    pkg = require(pkgPath);
  } catch (e) {
    console.log(
      `Could not read package.json. To generate a report, make sure to run nvnr within the same directory as your application's package.json.\n` +
        `You can also use the -p flag to specify a path instead.\nSearched for package.json in ${workingDirectory}`
    );
  }

  if (pkg) {
    let nodeModuleList = getNodeModulesDirNames(workingDirectory);
    let Dvnr = new NodeDvnr(pkg, workingDirectory);
    let logFileName = Dvnr.logFileName;
    let all_deps = getDependencies(pkg);
    let dependencies = all_deps[0];
    let devDependencies = all_deps[1];
    printBanner();
    Dvnr.printSystemInfo();
    Dvnr.printNpmScripts();

    Dvnr.searchDependencies(dependencies, devDependencies, nodeModuleList);
    Dvnr.printAddons();

    if (fs.existsSync(`nvnr-${logFileName}.txt`)) {
      console.log(
        `\nWrote report to nvnr-${logFileName}.txt to ${process.env.PWD}`
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
