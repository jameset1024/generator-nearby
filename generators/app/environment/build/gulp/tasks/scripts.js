import gulp from "gulp";
import webpackstream from "webpack-stream";
import webpack from "webpack";

import {args, config, plugins, taskTarget} from "../utils";

import webpackConfig from "../webpack.config";

const dirs = config.directories;
const entries = config.entries;
const dest = `${taskTarget}${dirs.scripts}`;

gulp.task("scripts", () => {
  return gulp
    .src(`${dirs.source}${dirs.scripts}${entries.script}`)
    .pipe(webpackstream(webpackConfig, webpack))
    .pipe(plugins.if(args.production, plugins.rev()))
    .pipe(gulp.dest(dest))
});
