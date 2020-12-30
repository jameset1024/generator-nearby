import path from 'path';
import del from 'del';
import gulp from 'gulp';

import { config } from '../utils';

const dirs = config.directories;

// Clean
gulp.task('clean', () =>
	del([
		path.join(dirs.destination)
	])
);
