'use strict';

// Gulp
const gulp = require('gulp');

// Javascript bundler and transpiler
const rollup = require("rollup-stream");
const buble = require("rollup-plugin-buble");
const stream = require("vinyl-source-stream");

// Javascript minifier
const uglify = require("gulp-uglify");

// Utility to include files
const include = require("gulp-include");

// Utility to concat files
const concat = require("gulp-concat");

// Utility to append header to file
const header = require("gulp-header");

// Display size of file
const size = require("gulp-size");

// Package information
const pkg = require('./package.json');

// Header comment
const comment = `/**
 * Monx v${pkg.version}
 * Copyright 2017-2018 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/monx
 */\r\n`;

// Build Moon
gulp.task("build", function() {
  return rollup({
    input: "./src/index.js",
    format: "umd",
    name: "Monx",
    plugins: [buble({
      namedFunctionExpressions: false,
      transforms: {
        arrow: true,
        classes: false,
        collections: false,
        computedProperty: false,
        conciseMethodProperty: true,
        constLoop: false,
        dangerousForOf: false,
        dangerousTaggedTemplateString: false,
        defaultParameter: false,
        destructuring: false,
        forOf: false,
        generator: false,
        letConst: true,
        modules: false,
        numericLiteral: false,
        parameterDestructuring: false,
        reservedProperties: false,
        spreadRest: false,
        stickyRegExp: false,
        templateString: true,
        unicodeRegExp: false
      }
    })]
  })
    .pipe(stream("monx.js"))
    .pipe(header(comment + '\n'))
    .pipe(gulp.dest('./dist/'));
});

// Build minified (compressed) version of Monx
gulp.task('minify', ['build'], function() {
  return gulp.src(['./dist/monx.js'])
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(concat('monx.min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(size())
    .pipe(size({
      gzip: true
    }));
});

gulp.task("es6", function() {
  return rollup({
    input: "./src/index.js",
    format: "es",
  })
    .pipe(stream("monx.esm.js"))
    .pipe(header(comment + "\n"))
    .pipe(gulp.dest("./dist/"))
    .pipe(size());
});

// Default task
gulp.task('default', ['build', 'minify', 'es6']);
