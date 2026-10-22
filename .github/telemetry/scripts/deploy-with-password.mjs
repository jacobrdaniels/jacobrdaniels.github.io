// Supply the password on stdin, never in command arguments or a checked-in file.
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
process.stdout.write("Waiting for dashboard password on stdin.\n");
if (process.stdin.isTTY) process.stdin.setRawMode(true);
let input = "";
for await (const chunk of process.stdin) { input += chunk; if (/[\r\n]/.test(input)) break; }
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const password = input.replace(/[\r\n]+$/, "");
if (password.length < 16 || password.length > 200) throw new Error("Use a password of 16–200 characters.");
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, Buffer.from(salt, "hex"), 100000, 32, "sha256").toString("hex");
const dir = mkdtempSync(join(tmpdir(), "jrdaniels-secret-"));
const file = join(dir, "secrets.json");
try {
  writeFileSync(file, JSON.stringify({ PASSWORD_HASH: JSON.stringify({ salt, hash }) }), { mode: 0o600 });
  const cli = fileURLToPath(new URL("../node_modules/cf/bin/cf", import.meta.url));
  const result = spawnSync(process.execPath, [cli, "deploy", "--secrets-file", file], { stdio: ["ignore", "inherit", "inherit"] });
  process.exitCode = result.status ?? 1;
} finally {
  // This exact directory was created above, outside the repository, for this operation.
  rmSync(file, { force: true });
  rmdirSync(dir);
}
