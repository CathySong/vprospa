import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const htmlFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry === "node_modules" || entry === ".git" || entry === "dist") continue;
    if (statSync(path).isDirectory()) walk(path);
    if (path.endsWith(".html")) htmlFiles.push(path);
  }
}

walk(root);

const required = [
  "VPRO Beauty Salon & Spa",
  "165 Speedwell Ave",
  "908-818-8869"
];

const bookingLink = "https://cal.com/cozyfamily/vpro-consultation";

let failed = false;
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const token of required) {
    if (!html.includes(token)) {
      console.error(`${file} is missing ${token}`);
      failed = true;
    }
  }

  if (!html.includes(bookingLink) && !html.includes("booking/")) {
    console.error(`${file} is missing a booking destination`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Checked ${htmlFiles.length} HTML files.`);
