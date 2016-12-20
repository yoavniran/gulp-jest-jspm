"use strict";

const gulp = require("gulp"),
    del = require("del"),
    gulpBabel = require("gulp-babel"),
    gulpJest = require("gulp-jest").default;

gulp.task("clean:lib", () => del(["lib/**/*"]));
gulp.task("clean:testOutput", () => del(["test/output/**/*"]));

gulp.task("build", ["clean:lib"], () =>
    gulp.src("src/**/*.js")
        .pipe(gulpBabel())
        .pipe(gulp.dest("lib")));

const runTest = (withCover) =>
    gulp.src("")
        .pipe(gulpJest({
            "verbose": true,
            "debug": false,
            "config": {
                "testPathDirs": ["./test"],
                "collectCoverage": withCover,
                "coverageDirectory": "output",
                "collectCoverageFrom": ["src/**/*.js"]
            }
        }));

gulp.task("test", () => runTest());
gulp.task("test:cover", ["clean:testOutput"], () => runTest(true));

gulp.task("default", ["build"]);