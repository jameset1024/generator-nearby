import gulp from "gulp";
import autoprefixer from "autoprefixer";
import Fiber from "fibers";
import gcmq from "gulp-group-css-media-queries";
import cssDeclarationSorter from "css-declaration-sorter";
import tildeImport from "node-sass-tilde-importer";

import {
  plugins,
  args,
  config,
  taskTarget,
  browserSync,
  reportError
} from "../utils";

const dirs = config.directories;
const entries = config.entries;
const dest = `${taskTarget}${dirs.css}`;
const postCssPlugins = [
  autoprefixer({
    grid: true
  }),
  cssDeclarationSorter({
    order: "concentric-css"
  })
];

gulp.task("sass", () => {
  return gulp
    .src(`${dirs.source}${dirs.css}${entries.css}`)
    .pipe(
      plugins.plumber({
        errorHandler: reportError
      })
    )
    .pipe(
      plugins.if(
        !args.production,
        plugins.sourcemaps.init({
          loadMaps: true
        })
      )
    )
    .pipe(
      plugins.sass({
        fiber: Fiber,
        outputStyle: "expanded",
        precision: 10,
        importer: tildeImport
      })
    )
    .on("error", function(err) {
      plugins.util.log(err);
    })
    .on("error", plugins.notify.onError(config.defaultNotification))
    .pipe(plugins.postcss(postCssPlugins))
    .pipe(plugins.if(!args.production, gcmq()))
    .pipe(
      plugins.if(
        args.production,
        plugins.cssnano({
          rebase: false
        })
      )
    )
    .pipe(plugins.if(!args.production, plugins.sourcemaps.write("./")))
    .pipe(plugins.if(args.production, plugins.rev()))
    .pipe(gulp.dest(dest))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});
