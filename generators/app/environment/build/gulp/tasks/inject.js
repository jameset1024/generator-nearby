import gulp from 'gulp';

import { config, plugins, taskTarget } from '../utils';

const dirs = config.directories;


// Inject Js
gulp.task('inject', () => {
    return gulp.src(config.inject, {allowEmpty: true})
        .pipe(plugins.inject(gulp.src([`${taskTarget}${dirs.css}*.css`], {read: false}), {
            transform: ( filepath ) => {
                let path = filepath.substr(filepath.indexOf('dist/'));
                return `<link rel="stylesheet" href="{{ asset('${path}') }}">`;
            }
        }))
        .pipe(plugins.inject(gulp.src([`${taskTarget}${dirs.scripts}*.js`], {read: false}), {
            transform: ( filepath ) => {
                let path = filepath.substr(filepath.indexOf('dist/'));
                return `<script src="{{ asset('${path}') }}"></script>`;
            }
        }))
        .pipe(gulp.dest(`${dirs.views}partials`));
});
