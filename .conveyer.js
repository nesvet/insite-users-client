import path from "node:path";
import { Conveyer, ESBuild } from "@nesvet/conveyer";


const { NODE_ENV } = process.env;

const distDir = "dist";


new Conveyer([
	
	new ESBuild({
		entryPoints: [ "src/index.ts" ],
		outfile: path.resolve(distDir, "index.js"),
		external: [ true, "insite-*" ],
		local: "insite-common",
		platform: "neutral",
		target: "es2020",
		format: "esm",
		sourcemap: true,
		define: {
			"process.env.NODE_ENV": JSON.stringify(NODE_ENV)
		}
	})
	
], {
	initialCleanup: distDir
});
