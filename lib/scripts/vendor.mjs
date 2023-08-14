import fs from "node:fs/promises";
import fse from "fs-extra";
import path from "node:path";
import { glob } from "glob";
import { transformFileAsync } from "@babel/core";

// d3-arrayd3-formatd3-interpolated3-timed3-time-format
const VENDORED_PACKAGES = [
  "internmap",
  "d3-array",
  "d3-format",
  "d3-interpolate",
  "d3-time",
  "d3-time-format",
  "d3-scale",
  "d3-color",
];
const vendorBase = path.resolve(process.cwd(), "lib/src/vendor");

const main = async () => {
  for (const pkg of VENDORED_PACKAGES) {
    const pkgBase = path.resolve(process.cwd(), "node_modules", pkg, "src");

    const jsFiles = await glob(path.resolve(pkgBase, "**/*.js")).then((files) =>
      files.map((file) => path.relative(pkgBase, file)),
    );

    await fse.emptyDir(path.resolve(vendorBase, pkg));
    await fse.ensureDir(path.resolve(vendorBase, pkg));

    // Transform each file
    for (const file of jsFiles) {
      const { code } = await transformFileAsync(path.resolve(pkgBase, file), {
        configFile: path.resolve(process.cwd(), "lib/scripts/.babelrc.js"),
      });

      await fse.outputFile(path.resolve(vendorBase, pkg, file), code, "utf-8");
    }

    // Type files
    const typeFilePath = path.resolve(
      process.cwd(),
      "node_modules",
      `@types/${pkg}`,
      "index.d.ts",
    );

    try {
      await fse.copy(typeFilePath, path.resolve(vendorBase, pkg, "index.d.ts"));
    } catch {}
  }
};

main().catch(console.error);
