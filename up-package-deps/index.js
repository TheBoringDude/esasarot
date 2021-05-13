#!/usr/bin/env node
const yargs = require("yargs");
const updeps = require("./update");

yargs
	.scriptName("upd")
	.usage("$0 <cmd> [args]")
	.command(
		"update",
		"...update dependencies",
		(yargs) => {
			yargs
				.option("d", {
					alias: "dev",
					type: "boolean",
					describe: "update only the devDependencies",
				})
				.option("m", {
					alias: "main",
					type: "boolean",
					describe: "update only the depencies",
				});
		},
		function (args) {
			var mode = "all";

			if (args.dev) mode = "dev";
			if (args.main) mode = "main";
			if (args.main && args.dev) mode = "all";

			return updeps(mode);
		}
	)
	.help().argv;
