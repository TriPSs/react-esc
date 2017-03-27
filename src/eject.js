// @remove-file-on-eject

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

import fs from 'fs-extra'
import path from 'path'
import prompt from 'react-dev-utils/prompt'
import chalk from 'chalk'
const spawnSync = require('cross-spawn').sync;

const green = chalk.green;
const cyan  = chalk.cyan;

prompt(
  'Are you sure you want to eject? This action is permanent.',
  false
).then(shouldEject => {
  if (!shouldEject) {
    console.log(cyan('Close one! Eject aborted.'));
    process.exit(0);
  }

  console.log('Ejecting...');

  const appDirectory = fs.realpathSync(process.cwd());

  function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
  }

  // @remove-on-eject-begin
  function resolveOwn(relativePath) {
    return path.resolve(__dirname, './src', relativePath);
  }

  const ownPath = resolveOwn('.');
  const appPath = resolveApp('.');

  const fileExceptions = [
    'client.js',
    'server.js',
    'config'
  ]

  function verifyAbsent(file) {
    if (fileExceptions.indexOf(file))
      return;

    if (fs.existsSync(path.join(appPath, file))) {
      console.error(
        `\`${file}\` already exists in your app folder. We cannot ` +
        'continue as you would lose all the changes in that file or directory. ' +
        'Please move or delete it (maybe make a copy for backup) and run this ' +
        'command again.'
      );
      process.exit(1);
    }
  }

  const folders = [
    'config',
    'bin',
    'server',
    'server/lib',
    'server/middleware',
    'client',
    'client/modules',
    'client/store',
    'build'
  ];

  // Make shallow array of files paths
  const files = folders.reduce(
    (files, folder) => {
      return files.concat(
        fs
          .readdirSync(path.join(ownPath, folder))
          // set full path
          .map(file => path.join(ownPath, folder, file))
          // omit dirs from file list
          .filter(file => fs.lstatSync(file).isFile())
      );
    },
    []
  );

  // Ensure that the app folder is clean and we won't override any files
  folders.forEach(verifyAbsent);
  files.forEach(verifyAbsent);

  console.log();
  console.log(cyan(`Copying files into ${appPath}`));

  folders.forEach(folder => {
    if (!fs.existsSync(path.join(appPath, folder)))
      fs.mkdirSync(path.join(appPath, folder));
  });

  files.forEach(file => {
    if (file.indexOf('.eject') > -1)
      return

    let content = fs.readFileSync(file, 'utf8');

    if (fs.existsSync(`${file}.eject`)) {
      console.log(`  ${cyan(file.replace(ownPath, ''))} has a eject file, getting that one!`);
      content = fs.readFileSync(`${file}.eject`, 'utf8');
    }

    // Skip flagged files
    if (content.match(/\/\/ @remove-file-on-eject/)) {
      return;
    }

    content = content
              // Remove dead code from .js files on eject
                .replace(
                  /\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/mg,
                  ''
                )
                // Remove dead code from .applescript files on eject
                .replace(
                  /-- @remove-on-eject-begin([\s\S]*?)-- @remove-on-eject-end/mg,
                  ''
                )
                .trim() + '\n';
    console.log(`  Adding ${cyan(file.replace(ownPath, ''))} to the project`);

    let fileLoc = file.replace(ownPath, appPath)
    if (fileLoc.indexOf('/client/') > -1) {
      fileLoc = fileLoc.replace('/client', '/src')
    }


    fs.writeFileSync(fileLoc, content);
  });
  console.log();

  const ownPackage = require(path.join(ownPath, '../package.json'));
  const appPackage = require(path.join(appPath, 'package.json'));

  console.log(cyan('Updating the dependencies'));
  const ownPackageName = ownPackage.name;
  if (appPackage.devDependencies[ownPackageName]) {
    console.log(`  Removing ${cyan(ownPackageName)} from devDependencies`);
    delete appPackage.devDependencies[ownPackageName];
  }
  if (appPackage.dependencies[ownPackageName]) {
    console.log(`  Removing ${cyan(ownPackageName)} from dependencies`);
    delete appPackage.dependencies[ownPackageName];
  }

  Object.keys(ownPackage.dependencies).forEach(key => {
    // For some reason optionalDependencies end up in dependencies after install
    if (ownPackage.optionalDependencies[key]) {
      return;
    }
    console.log(`  Adding ${cyan(key)} to devDependencies`);
    appPackage.devDependencies[key] = ownPackage.dependencies[key];
  });
  console.log();

  console.log();
  console.log(cyan('Configuring package.json'));
  // Add Jest config
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + '\n'
  );
  console.log();

  // "Don't destroy what isn't ours"
  if (ownPath.indexOf(appPath) === 0) {
    try {
      // remove react-scripts and react-scripts binaries from app node_modules
      Object.keys(ownPackage.bin).forEach(binKey => {
        fs.removeSync(path.join(appPath, 'node_modules', '.bin', binKey));
      });
      fs.removeSync(ownPath);
    } catch (e) {
      // It's not essential that this succeeds
    }
  }

  console.log(cyan('Running npm install...'));
  spawnSync('npm', ['install'], { stdio: 'inherit' });

  console.log(green('Ejected successfully!'));
  console.log();
});