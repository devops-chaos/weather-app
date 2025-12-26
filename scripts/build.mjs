import fs from "fs";
import path from "path";

const srcDir = path.resolve("src");
const distDir = path.resolve("dist");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}

console.log("Build complete: dist/");
