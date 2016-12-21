"use strict";
import {isString} from "./utils";
import loadConfig from "./jspmConfigLoader";

const getMapValue = (value) =>
	((!~value.indexOf("@") ? "<rootDir>/" : "") + value.replace(/[\d\w\-]*:/, ""));

const processMapItem = (map, res, key) => {
	if (isString(map[key])) {
		const newKey = `^${key}$`;

		if (!res[newKey]) { //avoid duplicates
			res[newKey] = getMapValue(map[key]); //set the exact match
			res[`^${key}\/(.*)`] = res[newKey] + "/$1";  //set a match for a dir
		}
	}
	else {
		res = iterateSjsConfigMap(map[key], res); //continue iterating
	}

	return res;
};

const iterateSjsConfigMap = (map, base = {}) =>
	(map ? Object.keys(map).reduce((res, key) =>
				processMapItem(map, res, key)
			, base) : base);

const iterateSjsConfigPackages = (packages, base = {}) =>
	(packages ? Object.keys(packages).reduce((res, key) =>
				(packages[key].map ? iterateSjsConfigMap(packages[key].map, res) : res )
			, base) : {});

export default (basePath, options) => {
	const systemJsConfig = loadConfig(basePath, options);

	return (systemJsConfig ?
		iterateSjsConfigPackages(systemJsConfig.packages, iterateSjsConfigMap(systemJsConfig.map)) :
		{}); //return empty object for no config
};