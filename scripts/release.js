#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, options = {}) {
  try {
    console.log(`\n📝 Executing: ${command}`);
    const result = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options 
    });
    return result;
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    throw error;
  }
}

function getCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return pkg.version;
}

function updateVersion(newVersion) {
  // Update package.json
  const pkgPath = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✅ Updated ${pkgPath} to v${newVersion}`);

  // Update Constants.js
  const constantsPath = 'src/utils/Constants.js';
  let constants = fs.readFileSync(constantsPath, 'utf8');
  constants = constants.replace(
    /export const CARD_VERSION = ["']([^"']+)["']/,
    `export const CARD_VERSION = "${newVersion}"`
  );
  fs.writeFileSync(constantsPath, constants);
  console.log(`✅ Updated ${constantsPath} to v${newVersion}`);
}

function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;
  return semverRegex.test(version);
}

async function main() {
  console.log('\n🚀 Simple Swipe Card Release Script\n');

  // Check if working directory is clean
  try {
    const status = exec('git status --porcelain', { silent: true });
    if (status.trim()) {
      console.log('⚠️  You have uncommitted changes:');
      console.log(status);
      const proceed = await question('\nDo you want to continue anyway? (y/N): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('❌ Release cancelled');
        rl.close();
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error checking git status');
    rl.close();
    process.exit(1);
  }

  // Get current version
  const currentVersion = getCurrentVersion();
  console.log(`📦 Current version: v${currentVersion}\n`);

  // Ask for new version
  let newVersion;
  while (true) {
    newVersion = await question(`Enter new version (e.g., ${currentVersion}): `);
    if (validateVersion(newVersion)) {
      break;
    }
    console.log('❌ Invalid version format. Use semantic versioning (e.g., 2.6.2 or 2.6.2-beta.1)');
  }

  // Ask for release message
  const defaultMessage = `Release v${newVersion}`;
  const message = await question(`\nRelease message (default: "${defaultMessage}"): `) || defaultMessage;

  // Confirmation
  console.log('\n📋 Release Summary:');
  console.log(`   Version: ${currentVersion} → ${newVersion}`);
  console.log(`   Message: ${message}`);
  console.log(`   Tag: v${newVersion}\n`);

  const confirm = await question('Proceed with release? (y/N): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Release cancelled');
    rl.close();
    process.exit(0);
  }

  try {
    // Update versions
    console.log('\n📝 Updating version numbers...');
    updateVersion(newVersion);

    // Run release build
    console.log('\n🔨 Building release...');
    exec('npm run release');

    // Git operations
    console.log('\n📦 Committing changes...');
    exec('git add .');
    exec(`git commit -m "${message}"`);

    console.log('\n🏷️  Creating tag...');
    exec(`git tag v${newVersion}`);

    console.log('\n⬆️  Pushing to repository...');
    exec('git push');
    exec(`git push origin v${newVersion}`);

    console.log('\n✨ Release completed successfully!');
    console.log(`\n🎉 Version v${newVersion} has been released!`);
    console.log(`   - Committed with message: "${message}"`);
    console.log(`   - Tagged as: v${newVersion}`);
    console.log(`   - Pushed to remote repository`);
    console.log('\n📦 Next steps:');
    console.log('   - Create GitHub release at: https://github.com/nutteloost/simple-swipe-card/releases/new?tag=v' + newVersion);
    console.log('   - Add release notes from RELEASE-NOTES.md');

  } catch (error) {
    console.error('\n❌ Release failed!');
    console.error('You may need to manually clean up any partial changes.');
    rl.close();
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();