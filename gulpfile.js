/* eslint-env node */
const gulp = require("gulp"),
	concat = require("gulp-concat"),
	cache = require("gulp-cached"),
	less = require("gulp-less"),
	uglify = require("gulp-uglify"),
	sourcemaps = require('gulp-sourcemaps'),
	source = require("vinyl-source-stream"),
	buffer = require('vinyl-buffer'),
	browserify = require("browserify"),
	babelify = require("babelify"),
	browserSync = require("browser-sync").create(),
	del = require("del");

const src_dir = "./src",
	build_dir = "./build";

function catchErr(err) {
	console.error(err);
	this.emit('end');
}

function staticFiles() {
	return gulp.src(`${src_dir}/static/**/*`)
		.pipe(cache("static")) // do not copy file if it hasn't changed
		.pipe(gulp.dest(build_dir));
}

function styles() {
	return gulp.src(`${src_dir}/css/**/*.less`)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(concat("bundle.min.css"))
		.pipe(sourcemaps.write("./", { sourceRoot: "source://css" }))
		.pipe(gulp.dest(`${build_dir}/css`))
		.pipe(browserSync.stream());
}

function scripts() {
	return browserify({
			entries: [`main.js`],
			debug: true,
			basedir: `${src_dir}/js`,
		})
		.transform(babelify.configure({ // transpile es6+ code
			presets: ["@babel/preset-env"],
			sourceMaps: true,
		}))
		.bundle()
		.on('error', catchErr) // don't crash the watcher
		.pipe(source("bundle.min.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('./', { sourceRoot: "source://js" }))
		.pipe(gulp.dest(`${build_dir}/js`));
}

function clean() {
	return del(`${build_dir}/**/*`);
}

async function watch() {
	await clean();
	await build();

	browserSync.init({
		server: {
			baseDir: build_dir,
		},
		browser: [],
	});

	gulp.watch(`${src_dir}/static`, staticFiles)
		.on("change", browserSync.reload);
	gulp.watch(`${src_dir}/js`, scripts)
		.on("change", browserSync.reload);
	gulp.watch(`${src_dir}/css`, styles);
}

const build = gulp.parallel(staticFiles, styles, scripts);

module.exports = { build, watch, clean };
