#!/usr/bin/env node
'use strict';
const os = require('os');
const Section = require('./section.js');
const colors = require('./colors');
const readBinding = require('./addons.js').readBinding;
const _ = require('lodash');

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
        // console.log(`  env  ${env}`);
	}

	sysInfo.print();
}

function printHTTPFrameworks(dependencies) {
	const appInfo = new Section('Application Framework(s) and Utilities Used');

    const connectRegExp = new RegExp('\"connect\"', 'i');
    const expressRegExp = new RegExp('\"express\"', 'i');
    const hapiRegExp = new RegExp('\"hapi\"', 'i');
    const koaRegExp = new RegExp('\"koa\"', 'i');
    const meteorRegExp = new RegExp('\"meteor\"', 'i');
    const reactRegExp = new RegExp('\"react\"', 'i');
    const sailsRegExp = new RegExp('\"sails\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	if (dependencies != null) {

		if (dependenciesString.search(connectRegExp) !== -1) {
			appInfo.addData('Connect', _.get(dependencies, 'connect', 'Unknown'));
		}

		if (dependenciesString.search(expressRegExp) !== -1) {
			appInfo.addData('Express', _.get(dependencies, 'express', 'Unknown'));
		}

		if (dependenciesString.search(hapiRegExp) !== -1) {
			appInfo.addData('Hapi', _.get(dependencies, 'hapi', 'Unknown'));
		}

		if (dependenciesString.search(koaRegExp) !== -1) {
			appInfo.addData('Koa', _.get(dependencies, 'koa', 'Unknown'));
		}

		if (dependenciesString.search(meteorRegExp) !== -1) {
			appInfo.addData('Meteor', _.get(dependencies, 'meteor', 'Unknown'));
		}

		if (dependenciesString.search(reactRegExp) !== -1) {
			appInfo.addData('React', _.get(dependencies, 'react', 'Unknown'));
		}

		if (dependenciesString.search(sailsRegExp) !== -1) {
			appInfo.addData('Sails', _.get(dependencies, 'sails', 'Unknown'));
		}

	}

	appInfo.print();
}

function printTestFrameworks(dependencies, devDependencies) {
	const testInfo = new Section('Test Frameworks Used');

    const chaiRegExp = new RegExp('\'chai\'', 'i');
    const espressoRegExp = new RegExp('\"espresso\"', 'i');
    const jasmineCoreRegExp = new RegExp('jasmine-core', 'i');
    const jasmineNodeRegExp = new RegExp('jasmine-node', 'i');
    const jasmineRegExp = new RegExp('jasmine(?!-)', 'i');
    const jestRegExp = new RegExp('\"jest\"', 'i');
    const jsUnitRegExp = new RegExp('\"jsunit\"', 'i');
    const mochaRegExp = new RegExp('\"mocha\"', 'i');
    const nodeUnitRegExp = new RegExp('\"nodeunit\"', 'i');
    const shouldRegExp = new RegExp('\"should\"', 'i');
    const vowsRegExp = new RegExp('\"vows\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(chaiRegExp) !== -1 || devDependenciesString.search(chaiRegExp) !== -1) {
		testInfo.addData('Chai', _.get(devDependencies, 'chai', dependencies.chai));
	}

	if (dependenciesString.search(espressoRegExp) !== -1 || devDependenciesString.search(espressoRegExp) !== -1) {
		testInfo.addData('Espresso', _.get(devDependencies, 'espresso', dependencies.espresso));
	}

	if (dependenciesString.search(jasmineRegExp) !== -1
        || devDependenciesString.search(jasmineRegExp) !== -1) {
		testInfo.addData('Jasmine', _.get(devDependencies, 'jasmine', _.get(dependencies, 'jasmine', '')));
	}

	if (dependenciesString.search(jasmineCoreRegExp) !== -1
        || devDependenciesString.search(jasmineCoreRegExp) !== -1) {
		testInfo.addData('Jasmine-Core', _.get(devDependencies, 'jasmine-core', _.get(dependencies, 'jasmine-core', '')));
	}

	if (dependenciesString.search(jasmineNodeRegExp) !== -1
        || devDependenciesString.search(jasmineNodeRegExp) !== -1) {
		testInfo.addData('Jasmine-Node', _.get(devDependencies, 'jasmine-node', _.get(dependencies, 'jasmine-node', '')));
	}

	if (dependenciesString.search(jestRegExp) !== -1 || devDependenciesString.search(jestRegExp) !== -1) {
		testInfo.addData('Jest', _.get(devDependencies, 'jest', dependencies.jest));
	}

	if (dependenciesString.search(jsUnitRegExp) !== -1 || devDependenciesString.search(jsUnitRegExp) !== -1) {
		testInfo.addData('jsUnit', _.get(devDependencies, 'jsunit', dependencies.jsunit));
	}

	if (dependenciesString.search(mochaRegExp) !== -1 || devDependenciesString.search(mochaRegExp) !== -1) {
		testInfo.addData('Mocha', _.get(devDependencies, 'mocha', dependencies.mocha));
	}

	if (dependenciesString.search(nodeUnitRegExp) !== -1 || devDependenciesString.search(nodeUnitRegExp) !== -1) {
		testInfo.addData('NodeUnit', _.get(devDependencies, 'nodeunit', dependencies.nodeunit));
	}

	if (dependenciesString.search(shouldRegExp) !== -1 || devDependenciesString.search(shouldRegExp) !== -1) {
		testInfo.addData('Should', _.get(devDependencies, 'should', dependencies.should));
	}

	if (dependenciesString.search(vowsRegExp) !== -1 || devDependenciesString.search(vowsRegExp) !== -1) {
		testInfo.addData('Vows', _.get(devDependencies, 'vows', dependencies.vows));
	}


	testInfo.print();
}

function printDaemonRunners(dependencies, devDependencies) {
	const daemonInfo = new Section('Daemon/Runner Used');

    const foreverRegExp = new RegExp('\"forever\"', 'i');
    const nodemonRegExp = new RegExp('\"nodemon\"', 'i');
    const pm2RegExp = new RegExp('\"pm2\"', 'i');
    const supervisorRegExp = new RegExp('\"supervisor\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(foreverRegExp) !== -1 || devDependenciesString.search(foreverRegExp) !== -1) {
		daemonInfo.addData('Forever', _.get(devDependencies, 'forever', _.get(dependencies, 'forever', 'Unknown')));
	}

	if (dependenciesString.search(nodemonRegExp) !== -1 || devDependenciesString.search(nodemonRegExp) !== -1) {
		daemonInfo.addData('Nodemon', _.get(devDependencies, 'nodemon', _.get(dependencies, 'nodemon', 'Unknown')));
	}

	if (dependenciesString.search(pm2RegExp) !== -1 || devDependenciesString.search(pm2RegExp) !== -1) {
		daemonInfo.addData('PM2', _.get(devDependencies, 'pm2', _.get(dependencies, 'pm2', 'Unknown')));
	}

	if (dependenciesString.search(supervisorRegExp) !== -1 || devDependenciesString.search(supervisorRegExp) !== -1) {
		daemonInfo.addData('Supervisor', _.get(devDependencies, 'supervisor', _.get(dependencies, 'supervisor', 'Unknown')));
	}

	daemonInfo.print();

}

function printTaskRunners(pkg, dependencies, devDependencies) {
	const runnerInfo = new Section('Task Runners Used');

	let scripts = _.get(pkg, 'scripts', '');
	const npmInfo = new Section('NPM Scripts');
	for (let script in scripts) {
		npmInfo.addData(script, scripts[script]);
	}
	runnerInfo.addData(npmInfo);

    const antRegExp = new RegExp('\"ant\"', 'i');
	const gruntRegExp = new RegExp('\"grunt\"', 'i');
	const gulpRegExp = new RegExp('\"gulp\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(antRegExp) !== -1 || devDependenciesString.search(antRegExp) !== -1) {
		runnerInfo.addData('Ant', _.get(devDependencies, 'ant', dependencies.ant));
	}

	if (dependenciesString.search(gruntRegExp) !== -1 || devDependenciesString.search(gruntRegExp) !== -1) {
		runnerInfo.addData('Grunt', _.get(devDependencies, 'grunt', dependencies.grunt));
	}

	if (dependenciesString.search(gulpRegExp) !== -1 || devDependenciesString.search(gulpRegExp) !== -1) {
		runnerInfo.addData('Gulp', _.get(devDependencies, 'gulp', dependencies.gulp));
	}

	runnerInfo.print();
}

function printTemplateEngines(dependencies, devDependencies) {
	const templateInfo = new Section('Template Engines Used');

	const ejsRegExp = new RegExp('\"ejs\"', 'i');
	const handlebarsRegExp = new RegExp('\"handlebars\"', 'i');
	const jadeRegExp = new RegExp('\"jade\"', 'i');
	const pugRegExp = new RegExp('\"pug\"', 'i');
	const swigRegExp = new RegExp('\"swig\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(ejsRegExp) !== -1 || devDependenciesString.search(ejsRegExp) !== -1) {
		templateInfo.addData('EJS', _.get(devDependencies, 'ejs', _.get(dependencies, 'ejs', 'Unknown')));
	}

	if (dependenciesString.search(handlebarsRegExp) !== -1 || devDependenciesString.search(handlebarsRegExp) !== -1) {
		templateInfo.addData('Handlebars', _.get(devDependencies, 'handlebars', _.get(dependencies, 'handlebars', 'Unknown')));
	}

	if (dependenciesString.search(jadeRegExp) !== -1 || devDependenciesString.search(jadeRegExp) !== -1) {
		templateInfo.addData('Jade', _.get(devDependencies, 'jade', _.get(dependencies, 'jade', 'Unknown')));
	}

	if (dependenciesString.search(pugRegExp) !== -1 || devDependenciesString.search(pugRegExp) !== -1) {
		templateInfo.addData('Pug', _.get(devDependencies, 'pug', _.get(dependencies, 'pug', 'Unknown')));
	}

	if (dependenciesString.search(swigRegExp) !== -1 || devDependenciesString.search(swigRegExp) !== -1) {
		templateInfo.addData('Swig', _.get(devDependencies, 'swig', _.get(dependencies, 'swig', 'Unknown')));
	}

	templateInfo.print();
}

function printLoggingInfo(dependencies, devDependencies) {
	const loggingInfo = new Section('Logging Frameworks Used');

    const bunyanRegExp = new RegExp('\"bunyan\"', 'i');
    const log4jsRegExp = new RegExp('\"log4js\"', 'i');
	const winstonRegExp = new RegExp('\"winston\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(bunyanRegExp) !== -1 || devDependenciesString.search(bunyanRegExp) !== -1) {
		loggingInfo.addData('Bunyan', _.get(devDependencies, 'bunyan', _.get(dependencies, 'bunyan', 'Unknown')));
	}

	if (dependenciesString.search(log4jsRegExp) !== -1 || devDependenciesString.search(log4jsRegExp) !== -1) {
		loggingInfo.addData('Log4js', _.get(devDependencies, 'log4js', _.get(dependencies, 'log4js', 'Unknown')));
	}

	if (dependenciesString.search(winstonRegExp) !== -1 || devDependenciesString.search(winstonRegExp) !== -1) {
		loggingInfo.addData('Winston', _.get(devDependencies, 'winston', _.get(dependencies, 'winston', 'Unknown')));
	}

	loggingInfo.print();
}

function printTranspilers(dependencies, devDependencies) {
	const transpilerInfo = new Section('Transpilers Used');

	const babelRegExp = new RegExp('\"babel\"', 'i');
	const coffeeRegExp = new RegExp('\"coffeescript\"', 'i');
	const coffeeDashRegExp = new RegExp('\"coffee-script\"', 'i');
	const typescriptRegExp = new RegExp('\"typescript\"', 'i');
	const standardRegExp = new RegExp('\"standard\"', 'i');


	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(babelRegExp) !== -1 || devDependenciesString.search(babelRegExp) !== -1) {
		transpilerInfo.addData('Babel', _.get(devDependencies, 'babel', _.get(dependencies, 'babel', 'Unknown')));
	}

	if (dependenciesString.search(coffeeRegExp) !== -1 || devDependenciesString.search(coffeeRegExp) !== -1) {
		transpilerInfo.addData('CoffeeScript', _.get(devDependencies, 'coffeescript', _.get(dependencies, 'coffeescript', 'Unknown')));
	}

	if (dependenciesString.search(coffeeDashRegExp) !== -1 || devDependenciesString.search(coffeeDashRegExp) !== -1) {
		transpilerInfo.addData('Coffee-Script', _.get(devDependencies, 'coffee-script', _.get(dependencies, 'coffee-script', 'Unknown')));
	}

	if (dependenciesString.search(standardRegExp) !== -1 || devDependenciesString.search(standardRegExp) !== -1) {
		transpilerInfo.addData('Standard', _.get(devDependencies, 'standard', _.get(dependencies, 'standard', 'Unknown')));
	}

	if (dependenciesString.search(typescriptRegExp) !== -1 || devDependenciesString.search(typescriptRegExp) !== -1) {
		transpilerInfo.addData('Typescript', _.get(devDependencies, 'typescript', _.get(dependencies, 'typescript', 'Unknown')));
	}

	transpilerInfo.print();
}

function printDatabases(dependencies, devDependencies) {
	const databaseInfo = new Section('Databases Used');

    const marsdbRegexp = new RegExp('\'marsdb\"', 'i');
    const mongoRegExp = new RegExp('\"mongodb\"', 'i');
    const mysqlRegExp = new RegExp('\"mysql\"', 'i');
    const redisRegExp = new RegExp('\"redis\"', 'i');
    const sequelizeRegExp = new RegExp('\"sequelize\"', 'i');
    const sqlite3RegExp = new RegExp('\"sqlite3\"', 'i');
    const sqliteRegExp = new RegExp('\"sqlite\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(marsdbRegexp) !== -1 || devDependenciesString.search(marsdbRegexp) !== -1) {
		databaseInfo.addData('MarsDB', _.get(devDependencies, 'marsdb', _.get(dependencies, 'marsdb', 'Unknown')));
	}

	if (dependenciesString.search(mongoRegExp) !== -1 || devDependenciesString.search(mongoRegExp) !== -1) {
		databaseInfo.addData('Mongodb', _.get(devDependencies, 'mongodb', _.get(dependencies, 'mongodb', 'Unknown')));
	}

	if (dependenciesString.search(mysqlRegExp) !== -1 || devDependenciesString.search(mysqlRegExp) !== -1) {
		databaseInfo.addData('MySQL', _.get(devDependencies, 'mysql', _.get(dependencies, 'mysql', 'Unknown')));
	}

	if (dependenciesString.search(redisRegExp) !== -1 || devDependenciesString.search(redisRegExp) !== -1) {
		databaseInfo.addData('Redis', _.get(devDependencies, 'redis', _.get(dependencies, 'redis', 'Unknown')));
	}

	if (dependenciesString.search(sequelizeRegExp) !== -1 || devDependenciesString.search(sequelizeRegExp) !== -1) {
		databaseInfo.addData('Sequelize', _.get(devDependencies, 'sequelize', _.get(dependencies, 'sequelize', 'Unknown')));
	}

	if (dependenciesString.search(sqliteRegExp) !== -1 || devDependenciesString.search(sqliteRegExp) !== -1) {
		databaseInfo.addData('Sqlite', _.get(devDependencies, 'sqlite', _.get(dependencies, 'sqlite', 'Unknown')));
	}

	if (dependenciesString.search(sqlite3RegExp) !== -1 || devDependenciesString.search(sqlite3RegExp) !== -1) {
		databaseInfo.addData('Sqlite3', _.get(devDependencies, 'sqlite3', _.get(dependencies, 'sqlite3', 'Unknown')));
	}


	databaseInfo.print();
}


// misc: request.js, bluebird, etc
function printMiscInfo(dependencies, devDependencies) {
	const miscInfo = new Section('Misc Used');

	const asyncRegExp = new RegExp('\"async\"', 'i');
	const axiosRegExp = new RegExp('\"axios\"', 'i');
	const bluebirdRegExp = new RegExp('\"bluebird\"', 'i');
	const chalkRegExp = new RegExp('\"chalk\"', 'i');
	const cheerioRegExp = new RegExp('\"cheerio\"', 'i');
	const commanderRegExp = new RegExp('\"commander\"', 'i');
	const jqueryRegExp = new RegExp('\"jquery\"', 'i');
	const lodashRegExp = new RegExp('\"lodash\"', 'i');
	const momentRegExp = new RegExp('\"moment\"', 'i');
	const multerRegExp = new RegExp('\"multer\"', 'i');
	const notevilRegexp = new RegExp('\"notevil\"', 'i');
	const nycRegExp = new RegExp('\"nyc\"', 'i');
	const requestRegExp = new RegExp('\"request\"', 'i');
	const rxjsRegExp = new RegExp('\"rxjs\"', 'i');
	const through2RegExp = new RegExp('\"through2\"', 'i');
	const underscoreRegExp = new RegExp('\"underscore\"', 'i');
	const webpackRegExp = new RegExp('\"webpack\"', 'i');
	const yargsRegExp = new RegExp('\"yargs\"', 'i');

	let dependenciesString = JSON.stringify(dependencies);
	let devDependenciesString = JSON.stringify(devDependencies);

	if (dependenciesString.search(asyncRegExp) !== -1 || devDependenciesString.search(asyncRegExp) !== -1) {
		miscInfo.addData('Async', _.get(devDependencies, 'async', _.get(dependencies, 'async', 'Unknown')));
	}

	if (dependenciesString.search(axiosRegExp) !== -1 || devDependenciesString.search(axiosRegExp) !== -1) {
		miscInfo.addData('Axios', _.get(devDependencies, 'axios', _.get(dependencies, 'axios', 'Unknown')));
	}

	if (dependenciesString.search(bluebirdRegExp) !== -1 || devDependenciesString.search(bluebirdRegExp) !== -1) {
		miscInfo.addData('Bluebird', _.get(devDependencies, 'bluebird', _.get(dependencies, 'bluebird', 'Unknown')));
	}

	if (dependenciesString.search(chalkRegExp) !== -1 || devDependenciesString.search(chalkRegExp) !== -1) {
		miscInfo.addData('Chalk', _.get(devDependencies, 'chalk', _.get(dependencies, 'chalk', 'Unknown')));
	}

	if (dependenciesString.search(cheerioRegExp) !== -1 || devDependenciesString.search(cheerioRegExp) !== -1) {
		miscInfo.addData('Cheerio', _.get(devDependencies, 'cheerio', _.get(dependencies, 'cheerio', 'Unknown')));
	}

	if (dependenciesString.search(commanderRegExp) !== -1 || devDependenciesString.search(commanderRegExp) !== -1) {
		miscInfo.addData('Commander', _.get(devDependencies, 'commander', _.get(dependencies, 'commander', 'Unknown')));
	}

	if (dependenciesString.search(jqueryRegExp) !== -1 || devDependenciesString.search(jqueryRegExp) !== -1) {
		miscInfo.addData('JQuery', _.get(devDependencies, 'jquery', _.get(dependencies, 'jquery', 'Unknown')));
	}

	if (dependenciesString.search(lodashRegExp) !== -1 || devDependenciesString.search(lodashRegExp) !== -1) {
		miscInfo.addData('Lodash', _.get(devDependencies, 'lodash', _.get(dependencies, 'lodash', 'Unknown')));
	}

	if (dependenciesString.search(momentRegExp) !== -1 || devDependenciesString.search(momentRegExp) !== -1) {
		miscInfo.addData('Moment', _.get(devDependencies, 'moment', _.get(dependencies, 'moment', 'Unknown')));
	}

	if (dependenciesString.search(multerRegExp) !== -1 || devDependenciesString.search(multerRegExp) !== -1) {
		miscInfo.addData('Multer', _.get(devDependencies, 'multer', _.get(dependencies, 'multer', 'Unknown')));
	}

	if (dependenciesString.search(notevilRegexp) !== -1 || devDependenciesString.search(notevilRegexp) !== -1) {
		miscInfo.addData('NotEvil', _.get(devDependencies, 'notevil', _.get(dependencies, 'notevil', 'Unknown')));
	}

	if (dependenciesString.search(nycRegExp) !== -1 || devDependenciesString.search(nycRegExp) !== -1) {
		miscInfo.addData('NYC', _.get(devDependencies, 'nyc', _.get(dependencies, 'nyc', 'Unknown')));
	}

	if (dependenciesString.search(requestRegExp) !== -1 || devDependenciesString.search(requestRegExp) !== -1) {
		miscInfo.addData('Request', _.get(devDependencies, 'request', _.get(dependencies, 'request', 'Unknown')));
	}

	if (dependenciesString.search(rxjsRegExp) !== -1 || devDependenciesString.search(rxjsRegExp) !== -1) {
		miscInfo.addData('rxjs', _.get(devDependencies, 'rxjs', _.get(dependencies, 'rxjs', 'Unknown')));
	}

	if (dependenciesString.search(through2RegExp) !== -1 || devDependenciesString.search(through2RegExp) !== -1) {
		miscInfo.addData('Through2', _.get(devDependencies, 'through2', _.get(dependencies, 'through2', 'Unknown')));
	}

	if (dependenciesString.search(underscoreRegExp) !== -1 || devDependenciesString.search(underscoreRegExp) !== -1) {
		miscInfo.addData('Underscore', _.get(devDependencies, 'underscore', _.get(dependencies, 'underscore', 'Unknown')));
	}

	if (dependenciesString.search(webpackRegExp) !== -1 || devDependenciesString.search(webpackRegExp) !== -1) {
		miscInfo.addData('Webpack', _.get(devDependencies, 'webpack', _.get(dependencies, 'webpack', 'Unknown')));
	}

	if (dependenciesString.search(yargsRegExp) !== -1 || devDependenciesString.search(yargsRegExp) !== -1) {
		miscInfo.addData('Yargs', _.get(devDependencies, 'yargs', _.get(dependencies, 'yargs', 'Unknown')));
	}

	miscInfo.print();
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

		printHTTPFrameworks(dependencies, devDependencies);
		printTestFrameworks(dependencies, devDependencies);
		printTaskRunners(pkg, dependencies, devDependencies);
		printDaemonRunners(dependencies, devDependencies);
		printTemplateEngines(dependencies, devDependencies);
		printLoggingInfo(dependencies, devDependencies);
		printTranspilers(dependencies, devDependencies);
		printDatabases(dependencies, devDependencies);
		printMiscInfo(dependencies, devDependencies);
	}

	addons();
}

main();
