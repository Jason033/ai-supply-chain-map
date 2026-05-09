#!/usr/bin/env node
import { writeSiteData } from "./lib/build-site-data.js";

const outputPath = await writeSiteData({ rootDir: process.cwd() });
console.log(`Wrote ${outputPath}`);
