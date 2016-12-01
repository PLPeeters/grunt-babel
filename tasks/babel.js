'use strict';
var path = require('path');
var babel = require('babel-core');

module.exports = function (grunt) {
	grunt.registerMultiTask('babel', 'Use next generation JavaScript, today', function () {
		var options = this.options();

		var that = this;
		var count = 0;

		this.files.forEach(function (el) {
			el.src.forEach(function (file) {
				delete options.filename;
				delete options.filenameRelative;

				options.sourceFileName = path.relative(path.dirname(el.dest), file);

				if (process.platform === 'win32') {
					options.sourceFileName = options.sourceFileName.replace(/\\/g, '/');
				}

				options.sourceMapTarget = path.basename(el.dest);

				var res = babel.transformFileSync(file, options);
				var sourceMappingURL = '';

				if (res.map) {
					sourceMappingURL = '\n//# sourceMappingURL=' + path.basename(el.dest) + '.map';
				}

				var dest = file.replace(that.data.baseDir, el.dest);

				grunt.file.write(dest, res.code + sourceMappingURL + '\n');

				if (res.map) {
					grunt.file.write(dest + '.map', JSON.stringify(res.map));
				}

				count += 1;
			});
		});

		grunt.log.writeln('Processed ' + count + ' files.')
	});
};
