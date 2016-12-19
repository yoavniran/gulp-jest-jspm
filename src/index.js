"use strict";

import path from "path";
import through from "through2";
import {isString, isFunction} from "./utils";
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
            config = require(path.join(basePath, options.jestConfig));
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

    if (!mappings){
        console.warn("[gulp-jest-jspm-config]: didnt find any mappings for JSPM!");
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
    const config = loadExistingJestConfig(basePath, options);

    config.moduleNameMapper = {...getModuleMappingsForJspm(basePath, options), ...config.moduleNameMapper};
    config.moduleDirectories = getModuleDirectories(config, options);

    return config;
};

/**
 *
 * @param options
 *          @param options.jestConfig - config object or string path to config json file (default: {})
 *          @param options.systemJs - where is system js located (default: "./jspm_packages/system")
 *          @param options.sjsConfigFile - where is the System JS config file located (default: "./config")
 *          @param options.loadSjsConfFile - whether to load the System JS config file (default: true)
 *          @param options.jspmPackages - location of jspm packages (default: "./jspm_packages")
 *          @param options.nodeModules - location of node modules dir (default: "./node_modules")
 */
export default (options) => {
    options = getOptions(options);

    const myStream = through.obj((file, enc, cb) => {
        const jestConf = getJestConfig(file.cwd, options);

        jestConf.rootDir = jestConf.rootDir || file.cwd;
        myStream.pipe(gulpJest({config: jestConf})); //run jest through the gulp-jest plugin

        cb(null, file);
    });

    return myStream;
};