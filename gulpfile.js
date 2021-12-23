var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var pump = require('pump');
var plugins = require('gulp-load-plugins')({
	rename: {
		'gulp-angular-templatecache': 'templatecache',
		'gulp-ng-annotate': 'annotate',
		'gulp-minify-css': 'minifycss'
	}
});
var paths = {
  sass: ['./scss/**/*.scss']
};


// Working environment

var environment = '';
var destination = './www/';

gulp.task('env.dev', function() {
	environment = 'dev';
});

gulp.task('env.prod', function() {
	environment = 'prod';
});



gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

// Compile app

gulp.task('js', function(cb) {
	srcjs = [
		'./www/js/app.js',
		'./www/js/*.js',
	];

	if (process.env['ENV']) {
		srcjs = srcjs.concat([
			'!www/src/env~!(' + process.env['ENV'] + ').js',
		]);
	} else {
		srcjs = srcjs.concat([
			'!www/src/env~!(debug).js',
		]);
	};

	srcjs = srcjs.concat([
		'./wwwlib/*.js',
	]);

	pump([
		gulp.src(srcjs),
		plugins.concat('app.js'),
		gulp.dest(destination+'compile/'),
		plugins.annotate({single_quotes: true}),
		(environment == 'prod' ? plugins.uglify() : plugins.util.noop()),
		plugins.header(banner),
		gulp.dest(destination+'compile/')
	], cb);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});
