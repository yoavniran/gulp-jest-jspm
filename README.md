[![Coverage Status](https://coveralls.io/repos/github/yoavniran/gulp-jest-jspm/badge.svg?branch=master)](https://coveralls.io/github/yoavniran/gulp-jest-jspm?branch=master)
[![npm Version](https://img.shields.io/npm/v/gulp-jest-jspm.svg)](https://www.npmjs.com/package/gulp-jest-jspm) 
[![CircleCI](https://circleci.com/gh/yoavniran/gulp-jest-jspm/tree/master.svg?style=svg)](https://circleci.com/gh/yoavniran/gulp-jest-jspm/tree/master)

# gulp-jest-jspm

Gulp plugin for running Jest tests on JSPM/SystemJS apps

**_Reason_**: In case you're building an app with JSPM/SystemJS you are probably using its ability to store and map dependencies on top of the normal way NPM works.
 
The meaning of this is that SystemJS will hold a map of simplified names and map them to where it downloaded the packages to (typically under ./jspm_packages).
  
If you're also testing using the [Jest](https://facebook.github.io/jest/) framework you will quickly learn that Jest can't find the dependencies used by your modules since it doesn't know where SystemJS placed them.

This is where this plugin comes in, it augements the [moduleDirectories ](https://facebook.github.io/jest/docs/configuration.html#moduledirectories-array-string) and [moduleNameMapper](https://facebook.github.io/jest/docs/configuration.html#modulenamemapper-object-string-string) configuration parameters with the info Jest needs to be able to find these aliased modules, whether they are downloaded or your own.
    
 
## Usage

Install: 

```bash
$ npm install --save-dev gulp-jest-jspm jest-cli
```
> (note that jest-cli is a peer-dependency and is required to be installed as well)
 
In your gulpfile, require it:

```javascript
	const gulpJestJspm = require("gulp-jest-jspm");
```

This plugin internally calls ([gulp-jest](https://www.npmjs.com/package/gulp-jest)) so you don't need to install it.
However, if you wish you can use gulp-jest as a standalone plugin and simply pass it the generated configuration from this plugin (more on this below).

### option 1 - only use this plugin:
  
pass the path to the jest config to be loaded:
```javascript
 
 //test/client/jest.json
 {    
    "verbose": true,
	"setupTestFrameworkScriptFile": "<rootDir>/test/setupTests.js"
 }
 

//gulpfile.js  
gulp.task("jest", () => 
     gulp.src("test/client") // where your tests are stored
        .pipe(gulpJestJspm({
            jestConfig: "test/client/jest.json" //jest.json is a simple JSON file
        })));
```

Jest config can also be a module exporting an Object or a function that returns an Object:

```javascript

//test/client/jest.js
module.export = () =>({   
    verbose: true,
	setupTestFrameworkScriptFile: "<rootDir>/test/setupTests.js"
});


//gulpfile.js 
gulp.task("jest", () => 
	gulp.src("test/client") //where your tests are stored
        .pipe(gulpJestJspm({
            jestConfig: "test/client/jest.js" //jest.js exports an Object or a function 
        })));
```

Or you can pass jest configuration as an object
```javascript

//gulpfile.js 
gulp.task("jest", () => 
    gulp.src("test/client") //where your tests are stored
        .pipe(gulpJestJspm({
            jestConfig:{	           
	           	verbose: true,
                setupTestFrameworkScriptFile: "<rootDir>/test/setupTests.js"
            }
        })));
```

In addition you can pass any of the following options to the plugin

> **jestConfig** - config object or string path to config json file (default: {})

> **jestOptions** - config object passed to the Jest-CLI (for example {debug: true}) (default: undefined)

> **systemJs** - location of system js (default: "./jspm_packages/system")

> **sjsConfigFile** - location of System JS config file (default: "./config")

> **loadSjsConfFile** - whether to load the System JS config file (default: true)

> **jspmPackages** - location of jspm packages (default: "./jspm_packages")

> **nodeModules** - location of node modules dir (default: "./node_modules")

> **displayWarnings** - whether the plugin will output warnings to console (default: false)

For example if your SystemJS files are located somewhere that is not the default you can do the following:
  
```javascript

//gulpfile.js  
gulp.task("jest", () => 
    gulp.src("test/client") //where your tests are stored
        .pipe(gulpJestJspm({
            systemJs: "./libs/systemjs/systemjs.min.js",
            sjsConfigFile: "./dist/config.js",
            jestConfig:{	           
	           verbose: true,
	           setupTestFrameworkScriptFile: "<rootDir>/test/setupTests.js"
            }
        })));
```

### option 2 - continue using gulp-jest

Finally, if you're already using gulp-jest and don't wish to change to this plugin, you can get the generated configuration and pass it to the plugin call yourself:

```javascript

//gulpfile.js
gulp.task("jest", () => {
	const jestConf = gulpJestJspm.getJestConfig(__dirname,
        {jestConfig: "test/client/jest.json"}); //get the jest config

	return gulp.src("test/client")
    	.pipe(gulpJest({config: jestConf})); //pass it to gulp-jest
});
```


## License

[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png)](http://www.wtfpl.net/about/) Yoav Niran