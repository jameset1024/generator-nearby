import gulp from 'gulp';
import colors from 'colors';
import { execSync } from "child_process";

import { plugins, args, config, taskTarget, browserSync } from '../utils';

let banner = [
	' ',
	'/////////////////////////////////////',
	'//         Nearby Creative         //',
	'/////////////////////////////////////',
	' '
].join('\n');

gulp.task('done', done => {
	done();

	//Clears the views
	execSync('php artisan view:clear');

	return console.log(
		colors.rainbow('\nCongratulations!\n'),
		colors.green(banner),
		colors.magenta('\nBuild Finished!')
	);
});
