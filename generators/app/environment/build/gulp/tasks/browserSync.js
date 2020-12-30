import gulp from "gulp";
import fs from "fs";
import { execSync } from "child_process";

import { plugins, args, config, taskTarget, browserSync } from "../utils";

const dirs = config.directories;

gulp.task("browserSync", ( cb ) => {
	browserSync.init({
		open: args.open ? "local" : false,
		proxy: config.url
	});

	if (!args.production) {

	    //Clear view cache
	    execSync('php artisan view:clear');

		// Sass
		gulp.watch(
			[
				`${dirs.source}${dirs.css}**/*.{sass,scss}`
			],
			gulp.series("sass")
		);

		//Scripts
		gulp.watch(
			[
				`${dirs.source}${dirs.scripts}**/*.js`
			],
			gulp.series("scripts")
		);

		// Concat files
		gulp.watch(["./plugins.json"], gulp.parallel("concatCss"));

		// Fonts
		gulp.watch(
			[`${dirs.source}${dirs.assets}${dirs.fonts}**/*`],
			gulp.parallel("fonts")
		);

		// Images
		gulp.watch(
			[
				`${dirs.source}${dirs.assets}${dirs.images}**/*.{jpg,jpeg,gif,svg,png}`
			],
			gulp.parallel("images")
		).on("unlink", function(path) {
			let filePathInBuildDir = path
				.replace(
					`${dirs.source}${dirs.assets}${dirs.images}`,
					`${taskTarget}${dirs.images}`
				)
				.replace(
					".+(jpg|jpeg|gif|svg|png)",
					".+(jpg|jpeg|gif|svg|png)"
				);
			fs.unlink(filePathInBuildDir, err => {
				if (err) throw err;
				console.log(`---------- Delete:  ${filePathInBuildDir}`);
			});
		});

		// Watch .php change
		gulp.watch(`./**/*.php`).on("change", browserSync.reload);
	}

    process.stdin.resume();
    //Kills the docker container
    process.on('SIGINT', exitHandler.bind(null, {cleanup:true, cb: cb}));
    process.on('exit', exitHandler.bind(null, {exit: true}));
    process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
    process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
});

/**
 * Handles exiting the process
 *
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode){
    if(options.cleanup){
        console.log('\nClearing docker containers.');
        execSync("./build/docker/nearby -f build/docker/docker-compose.yaml down");
        options.cb();
        process.exit();
    }

    if (options.exit){
        console.log('\nProcess ended successfully. Press CTRL + C to continue.');
        process.exit();
    }
}
