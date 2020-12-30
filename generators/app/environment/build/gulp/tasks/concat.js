import gulp from 'gulp';
import fs from 'fs';
import stripCssComments from 'gulp-strip-css-comments';

import {plugins, config, taskTarget, args} from '../utils';

const dirs = config.directories;
const url = JSON.parse(fs.readFileSync('./plugins.json'));
const dest = `${taskTarget}/${dirs.css}`;

gulp.task('concatCss', () => {
	return gulp
		.src(url.styles, { allowEmpty: true })
		.pipe(stripCssComments())
		.pipe(plugins.concat('core.css'))
		.pipe(plugins.cssnano())
        .pipe(plugins.if(args.production, plugins.rev()))
        .pipe(gulp.dest(dest))
});
