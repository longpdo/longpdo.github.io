var gulp = require('gulp');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var cp = require('child_process');
var browserSync = require('browser-sync');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function (done) {
	return cp.spawn(jekyllCommand, ['build'], { stdio: 'inherit' })
		.on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', gulp.series(['jekyll-build'], function (done) {
	browserSync.reload();
	done();
}));

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', gulp.series(['jekyll-build'], function (done) {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
	done()
}));

/*
* Compile and minify sass
*/
gulp.task('sass', function () {
	return gulp.src('src/styles/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest('assets/css/'))
});

gulp.task('watch', function () {
	gulp.watch('src/styles/**/*.scss', gulp.series(['sass', 'jekyll-rebuild']));
	gulp.watch('src/img/**/*.{jpg,png,gif}', gulp.series(['imagemin']));
	gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], gulp.series(['jekyll-rebuild']));
});

gulp.task('default', gulp.series(['js', 'sass', 'fonts', 'browser-sync', 'watch']));
