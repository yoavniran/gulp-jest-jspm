"use strict";
// import path from "path";
import {getModuleFromAbsBasePath} from "./utils";

export default (basePath, options) => {

    const systemJS = getModuleFromAbsBasePath(basePath, options.systemJs); //require(path.join(basePath, options.systemJs));

    if (options.loadSjsConfFile) {
        getModuleFromAbsBasePath(basePath, options.sjsConfigFile); // require(path.join(basePath, options.sjsConfigFile)); //load the systemjs configuration so its available to the build process
    }

    return systemJS.getConfig();
};