// will use .updepsignore config file

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const packageManagers = {
	npm: "install",
	yarn: "add",
};

// read the package.json
function readPackageJson() {
	let packageJson;
	try {
		packageJson = fs.readFileSync(path.resolve(__dirname, "package.json"));
	} catch {
		console.error("There was a problem trying to read `package.json`");
		exit(1);
	}

	return JSON.parse(packageJson);
}

// extract the dependencies
function getDeps(mode) {
	const pjson = readPackageJson();

	var deps = [];

	switch (mode) {
		case "all":
			deps = [
				Object.keys(pjson.dependencies || []),
				Object.keys(pjson.devDependencies || []),
				// Object.keys(pjson.peerDependencies || []),
			];
			break;
		case "dev":
			deps = Object.keys(pjson.devDependencies || []);
			break;
		case "main":
			deps = Object.keys(pjson.dependencies || []);
			break;
	}

	return deps;
}

// main function updater ?
function UpDeps(mode) {
	const deps = getDeps(mode);

	var mainDeps = [],
		devDeps = [];
	//peerDeps = [];

	if (mode === "all") {
		mainDeps = deps[0];
		devDeps = deps[1];
		// peerDeps = deps[2]
	}

	if (mode === "dev") devDeps = deps;
	if (mode === "main") mainDeps = deps;

	var mgr = "";

	// respect lock files
	if (fs.existsSync(path.resolve(__dirname, "package-lock.json"))) {
		mgr = "npm";
	} else if (fs.existsSync(path.resolve(__dirname, "yarn.lock"))) {
		mgr = "yarn";
	} else {
		console.error("no lock files found... stopping");
		exit(1);
	}

	// spawn update commands
	if (mainDeps.length > 0) {
		const install = spawn(mgr, [packageManagers[mgr], ...mainDeps]);
		console.log("\nUpdating dependencies");
		install.on("error", (error) => {
			console.error(`error: ${error.message}`);
		});
		install.on("close", () => {
			console.log("\nUPD update done! ;)");
		});
	}

	if (devDeps.length > 0) {
		const install = spawn(mgr, [packageManagers[mgr], "-D", ...devDeps]);
		console.log("\nUpdating devDependencies");
		install.on("error", (error) => {
			console.error(`error: ${error.message}`);
		});
		install.on("close", () => {
			console.log("\nUPD update done! ;)");
		});
	}
}

module.exports = UpDeps;
