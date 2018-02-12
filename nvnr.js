#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js');

const readBinding = require('./addons.js').readBinding;

const deps = {
	http: [
		/express/, // add ways to find middleware (tab indented)
		/hapi/, // add way to add plugins (glue, joi, vision, etc.) (tab indented)
		/sails/,
		/koa/,
		/meteor/,
	],
	db: [
		/mysql/,
		/sqlite/,
		/mongo/,
		/redis/,
	],
	template: [],
	log: [],

	test: [],
	runners: [],
	transpilers: []
};

function banner () {
	const reportDate = (new Date()).toString();
	// console.log(colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)'));
	console.log(reportDate);
	console.log();
}

function printSystemInfo () {
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

	const cpuInfo = new Section('cpu');
	cpuInfo.addData('model', cpuModel);
	cpuInfo.addData('cores', cpuCores);
	cpuInfo.addData('speed', cpuSpeed);
	sysInfo.addData(cpuInfo);

	// sysInfo.addData('os', `${platform}, ${arch}`);
	// console.log(`  os   ${platform}, ${arch}`);
	// console.log(`  node ${nodeVersion}`);
	// console.log(`  mem  ${totalgb}gb`);

	// sysInfo.addSection
	// console.log('  cpu');
	// console.log(`    model ${cpuModel}`);
	// console.log(`    cores ${cpuCores}`);
	// console.log(`    speed ${cpuSpeed}`);

	if (env) {
		sysInfo.addData('env', env);
		// console.log(`  env  ${env}`);
	}

	sysInfo.print();
}

function http (pkg) {
	// sectionHeader('Application Framework(s) and Utilities Used:');

	// console.log();
}

function db (pkg) {
	// sectionHeader('Databases/ORMs Used:');

	// console.log();
}

// misc: request.js, bluebird, etc
function misc (pkg) {
	// sectionHeader('Other:');

	// console.log();
}

function addons () {
	// sectionHeader('C++ Addons:');

	// readBinding((err, data) => {
	// 	if (err) {
	// 		console.log('  No binding.gyp found.');
	// 	}

	// 	console.log();
	// });

}

function main () {
	banner();
	printSystemInfo();

	var pkg;
	try {
		pkg = require('./package.json');
	} catch (e) {
		console.log('Could not read package.json. To fully check compatibility, make sure to run nvnr in the same directory as your application\'s package.json.');
	}

	// if (pkg) {
	// 	httpFrameworks(pkg);
	// 	databases(pkg);
	// 	misc(pkg);
	// }

	addons();
}

main();
