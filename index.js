'use strict';
const os = require('os');
const util = require('util');
// const path = require('path');

const colors = {};
Object.keys(util.inspect.colors).forEach(color => {
	function changeColor (set, reset, str) {
		return `${set}${str}${reset}`;
	}
	const set = util.inspect.colors[color][0];
	const reset = util.inspect.colors[color][1];
	colors[color] = changeColor.bind(null, `\x1b[${set}m`, `\x1b[${reset}m`) ;
});
// console.log(colors);

const reportDate = (new Date()).toString();
// const cores = os.cpus().length;
// const umask = process.umask().toString(8);
// console.log(umask);
// console.log(cores);

function banner () {
	// console.log(colors.cyan('contrast nvnr (https://www.contrastsecurity.com/)'));
	console.log(reportDate);
	console.log();
}

function printSystemInfo () {
	const msg = '1. General Info:';
	const platform = `${process.platform} ${os.release()}`;
	const arch = os.arch();
	const nodeVersion = process.version;
	const env = process.env.NODE_ENV;

	const cpus = os.cpus();
	const cpuCores = cpus.length;
	const cpuModel = cpuCores >= 1 ? cpus[0].model : 'unknown';
	const cpuSpeed = cpuCores >= 1 ? cpus[0].speed : 'unknown';

	const totalmem = os.totalmem();
	const gig = Math.pow(2, 30);
	const totalgb = (totalmem / gig);

	console.log(colors.bold(msg));
	console.log(`  os   ${platform}, ${arch}`);
	console.log(`  node ${nodeVersion}`);
	console.log(`  mem  ${totalgb}gb`);
	console.log('  cpu');
	console.log(`    model ${cpuModel}`);
	console.log(`    cores ${cpuCores}`);
	console.log(`    speed ${cpuSpeed}`);

	if (env) {
		console.log(`  env  ${env}`);
	}

	console.log();
}

function httpFrameworks (pkg) {
	const msg = '2. Application Framework(s) and Utilities Used:';
	console.log(colors.bold(msg));

	console.log();
}

function databases (pkg) {
	const msg = '3. Databases/ORMs Used:';
	console.log(colors.bold(msg));

	console.log();
}

// misc: request.js, bluebird, etc
function misc (pkg) {
	const msg = '4. Other:';
	console.log(colors.bold(msg));

	console.log();
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

	if (pkg) {
		httpFrameworks(pkg);
		databases(pkg);
		misc(pkg);
	}
}

main();
