/*global require*/
"use strict";
import path from "path";

const objToStr = Object.prototype.toString;
const isString = (str) => (typeof str == "string" || objToStr.call(str) === "[object String]");

const isFunction = (val) => {
	const fnStr = objToStr.call(val);
	return fnStr === "[object Function]" || fnStr === "[object GeneratorFunction]";
};

const getModuleFromAbsBasePath = (base, modulePath) =>
	require(path.join(base, modulePath)); // eslint-disable-line global-require

const showWarning = (msg) => {
	console.warn(msg); // eslint-disable-line no-console
};

export {
	isString,
	isFunction,
	getModuleFromAbsBasePath,
	showWarning
};