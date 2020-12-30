
import gulp from 'gulp';
import glob from 'glob';


glob.sync('./build/gulp/tasks/**/*.js')
	.filter(function(file) {
		return /\.(js)$/i.test(file);
	})
	.map(function(file) {
		require(file);
	});

gulp.task(
	'serve',
	gulp.series([
		'clean',
		gulp.parallel(
			'sass',
			'scripts',
			'fonts',
			'images',
			'concatCss',
		),
		'inject',
		'browserSync'
	])
);

gulp.task(
	'build',
	gulp.series([
		'clean',
		gulp.parallel(
			'sass',
			'fonts',
			'images',
			'concatCss',
			'scripts',
		),
		'inject',
		'author',
		'size',
		'done'
	])
);

// Default task
gulp.task('default', gulp.series('clean', 'build'));

// Testing
gulp.task('test', gulp.series('eslint'));
