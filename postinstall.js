const fs = require("fs");
const path = require("path");

const package = require("./package");
const { debug } = require("console");

// Helpers
const reset = "\x1b[0m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

const log = (message) => console.log(`${blue}${message}${reset}`);

function fileExists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

// Main
log(`${package.name}@${package.version}`);

try {
  //Cross platform compatibility
  const lIndex = path.resolve(__dirname).lastIndexOf("node_modules");
  if (lIndex === -1) {
    throw "- Could not find node_modules directory in __dirname";
  }

  //Shift one position to the left because '\' was removed from line 28
  const base = path.resolve(__dirname.slice(0, lIndex-1));
  const atLink = path.resolve(base, "node_modules", '$');

  if (fileExists(atLink)) {
    if (base === fs.realpathSync(atLink)) {
      log("- $ symlink already points to base\n");
      process.exit();
    }

    throw "- File already exists: node_modules/$";
  }

  fs.symlinkSync(base, atLink, "junction");

  log(`- Created $ symlink to ${base}\n`);
} catch (error) {
  console.warn(`${yellow}${error}\n- Not creating $ symlink${reset}\n`);
}
