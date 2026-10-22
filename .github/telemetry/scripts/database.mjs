import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const cli = fileURLToPath(new URL("../node_modules/cf/bin/cf", import.meta.url));
const sql = readFileSync(new URL("../schema.sql", import.meta.url), "utf8");
const result = spawnSync(process.execPath, [cli, "d1", "query", "d9e5e5f4-54e5-465f-b9ba-ddeaf00345d5", "--sql", sql, ...process.argv.slice(2)], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
