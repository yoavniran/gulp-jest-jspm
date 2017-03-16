"use strict";

import through from "through2";
import gulpJest from "gulp-jest";
import jestJspm from "jest-jspm";

const makeJestConfig = (basePath, options) =>
	jestJspm(basePath, options);

/**
 *
 * @param options
 *          @param options.jestConfig - config object or string path to config json file (default: {})
 *          @param options.jestOptions - config object for the Jest CLI (default: undefined)
 *          @param options.systemJs - where is system js located (default: "./jspm_packages/system")
 *          @param options.sjsConfigFile - where is the System JS config file located (default: "./config")
 *          @param options.loadSjsConfFile - whether to load the System JS config file (default: true)
 *          @param options.jspmPackages - location of jspm packages (default: "./jspm_packages")
 *          @param options.nodeModules - location of node modules dir (default: "./node_modules")
 *          @param options.displayWarnings - whether the plugin will output warnings to console (default: false)
 */
export default (options) => {
	const myStream = through.obj((file, enc, cb) => {

		myStream.pipe(gulpJest({
			...options.jestOptions,
			config: makeJestConfig(file.cwd, options)
		})); //run jest through the gulp-jest plugin

		cb(null, file);
	});

	return myStream;
};

export {
	makeJestConfig
};