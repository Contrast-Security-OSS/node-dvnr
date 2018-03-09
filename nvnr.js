#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js');
const colors = require('./colors');
const readBinding = require('./addons.js').readBinding;
const _ = require('lodash');

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const loggingModules = [
	'bunyan',
	'log4js',
	'winston'];

const httpFrameWorks = [
	'connect',
	'express',
	'hapi',
	'koa',
	'meteor',
	'react',
	'sails'];

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
	'vows'];

const daemonRunners = [
	'forever',
	'nodemon',
	'pm2',
	'supervisor'];

const taskRunners = [
	'ant',
	'grunt',
	'gulp'];

const templateEngines = [
	'ejs',
	'handlebars',
	'jade',
	'pug',
	'swig'];

const transpilers = [
	'babel',
	'coffeescript',
	'coffee-script',
	'typescript',
	'standard'];

const databases = [
	'marsdb',
	'mongodb',
	'mysql',
	'redis',
	'sequelize',
	'sqllite3',
	'sqllite'];

const miscModules = [
	'async',
	'axios',
	'bluebird',
	'chalk',
	'cheerio',
	'commander',
	'jquery',
	'lodash',
	'moment',
	'multer',
	'notevil',
	'nyc',
	'request',
	'rxjs',
	'through2',
	'underscore',
	'webpack',
	'yargs'];

const all_sections = {
	'HTTP Frameworks': httpFrameWorks,
	'Testing Frameworks': testFrameworks,
	'Daemon Runners': daemonRunners,
	'Task Runners': taskRunners,
	'Template Engines': templateEngines,
	'Transpilers': transpilers,
	'Databases': databases,
	'Logging': loggingModules,
	'Misc': miscModules
};



function to_regex_map(strings) {
	return strings.map(s =>new RegExp(`\"${s}\"`, 'i'));
}



function banner() {
	const reportDate = (new Date()).toString();
	console.log(colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)'));
	console.log(reportDate);
	console.log();
}

function printSystemInfo() {
	const sysInfo = new Section('General Info');

	const platform = `${process.platform} ${os.release()}`;
	const arch = os.arch();
	const nodeVersion = process.version;
	const env = process.env.NODE_ENV;

	const totalmem = os.totalmem();
	const gig = Math.pow(2, 30);
	const totalgb = (totalmem / gig);

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


function printSection(sectionTitle, dependencies, devDependencies, search_map) {
	const section = new Section(sectionTitle);

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	search_map.forEach( (frameworkRegExp) => {
		if (dependenciesString.search(frameworkRegExp) !== -1 || devDependenciesString.search(frameworkRegExp) !== -1)  {
			let framework = frameworkRegExp.toString().replace(/"/g, '', ).replace('/i','').replace(/\//g, '');
			section.addData(capitalizeFirstLetter(framework), _.get(dependencies, framework, _.get(devDependencies, framework, 'Unknown')));
		}

	});

	section.print();

}


function addons() {
    // sectionHeader('C++ Addons:');

    // readBinding((err, data) => {
    // 	if (err) {
    // 		console.log('  No binding.gyp found.');
    // 	}

    // 	console.log();
    // });

}


function main() {
	banner();
	printSystemInfo();
	var pkg;
	try {
		pkg = require(process.env.PWD + '/package.json');
	} catch (e) {
		console.log('Could not read package.json. To fully check compatibility, make sure to run nvnr in the same directory as your application\'s package.json.');
	}

	if (pkg) {

		let dependencies = _.get(pkg, 'dependencies', _.get(pkg, 'Dependencies', ''));
		let devDependencies = _.get(pkg, 'devDependencies', _.get(pkg, 'devdependencies', ''));

		for(let section in all_sections) {
		    printSection(section, dependencies, devDependencies, to_regex_map(all_sections[section]));
		}
	}

	addons();
}

main();
