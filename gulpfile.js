"use strict";

const gulp = require("gulp"),
    del = require("del"),
    gulpBabel = require("gulp-babel"),
    gulpJest = require("gulp-jest").default;

gulp.task("clean:lib", () => del(["lib/**/*"]));

gulp.task("build", ["clean:lib"], () =>
    gulp.src("src/**/*.js")
        .pipe(gulpBabel())
        .pipe(gulp.dest("lib")));

gulp.task("test", () =>
    gulp.src("test").pipe(gulpJest({
        "testPathDirs": ["./test"]
    })));

gulp.task("default", ["build"]);