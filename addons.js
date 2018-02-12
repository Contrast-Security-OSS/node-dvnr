const fs = require('fs');

function readBinding (cb) {
	fs.readFile('binding.gyp', (err, data) => {
		if (data) {
			data = data.toString();
		}
		cb(err, data);
	});
}

module.exports.readBinding = readBinding;
