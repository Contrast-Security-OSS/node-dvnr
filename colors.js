'use strict';
const util = require('util');

const colors = {};
Object.keys(util.inspect.colors).forEach(color => {
	function changeColor (set, reset, str) {
		return `${set}${str}${reset}`;
	}
	const set = util.inspect.colors[color][0];
	const reset = util.inspect.colors[color][1];
	colors[color] = changeColor.bind(null, `\x1b[${set}m`, `\x1b[${reset}m`) ;
});

module.exports = colors;
// console.log(colors);
