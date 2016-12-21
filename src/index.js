"use strict";

import through from "through2";
import {isString, isFunction, getModuleFromAbsBasePath, showWarning} from "./utils";
import jspmMappingReader from "./jspmMappingReader";
import gulpJest from "gulp-jest";

const getOptions = (options) => ({
	loadSjsConfFile: true,
	systemJs: "./jspm_packages/system",
	sjsConfigFile: "./config",
	jspmPackages: "jspm_packages",
	nodeModules: "node_modules",
	...options
});

const loadExistingJestConfig = (basePath, options) => {
	let config = {};

	if (options.jestConfig) {
		if (isString(options.jestConfig)) { //load from file
			config = getModuleFromAbsBasePath(basePath, options.jestConfig);
			config = (isFunction(config) ? config() : config);
		}
		else {
			config = {...options.jestConfig};
		}
	}

	return config;
};

const getModuleMappingsForJspm = (basePath, options) => {
	let mappings = jspmMappingReader(basePath, options);

	if (!mappings) {
		if (options.displayWarnings) {
			showWarning("[gulp-jest-jspm-config]: didnt find any mappings for JSPM!");
		}

		mappings = {};
	}

	mappings["^npm:(.*)"] = `<rootDir>/${options.jspmPackages}/npm/$1`;
	mappings["^github:(.*)"] = `<rootDir>/${options.jspmPackages}/github/$1`;

	return mappings;
};

const getModuleDirectories = (config, options) => {
	const moduleDirectories = config.moduleDirectories || [options.nodeModules];
	return moduleDirectories.concat([`${options.jspmPackages}/npm`, `${options.jspmPackages}/github`]);
};

export const getJestConfig = (basePath, options) => {
	options = getOptions(options);

	const config = loadExistingJestConfig(basePath, options);

	config.moduleNameMapper = {...getModuleMappingsForJspm(basePath, options), ...config.moduleNameMapper};
	config.moduleDirectories = getModuleDirectories(config, options);
	config.rootDir = config.rootDir || basePath;

	return config;
};

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
			config: getJestConfig(file.cwd, options)
		})); //run jest through the gulp-jest plugin

		cb(null, file);
	});

	return myStream;
};