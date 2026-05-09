#!/usr/bin/env node
import { validateSiteContent } from "./lib/validate-content.js";

const result = await validateSiteContent({ rootDir: process.cwd() });
if (!result.valid) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}
console.log("Content validation passed");
