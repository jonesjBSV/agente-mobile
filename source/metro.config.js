const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const fs = require('fs');

console.error('[METRO-ULTRA-DEBUG] >>> metro.config.js execution started');
console.error(`[METRO-ULTRA-DEBUG] Node version: ${process.version}`);
console.error(`[METRO-ULTRA-DEBUG] __dirname: ${__dirname}`);
console.error(`[METRO-ULTRA-DEBUG] CWD: ${process.cwd()}`);

try {
  const relevantEnvVars = ['NODE_ENV', 'PATH', 'HOME', 'USER', 'PWD', 'EXPO_PROJECT_ROOT'];
  relevantEnvVars.forEach(key => {
    if (process.env[key]) {
      console.error(`[METRO-ULTRA-DEBUG] ENV[${key}]: ${process.env[key]}`);
    }
  });
} catch (e) {
  console.error('[METRO-ULTRA-DEBUG] Error logging env vars:', e.message);
}

try {
  const projectRoot = __dirname;
  console.error(`[METRO-ULTRA-DEBUG] Project root for defaultConfig: ${projectRoot}`);
  
  const config = getDefaultConfig(projectRoot);
  console.error('[METRO-ULTRA-DEBUG] Successfully obtained default config.');

  if (!config) {
    const errMsg = '[METRO-ULTRA-DEBUG] !!! defaultConfig is null or undefined after call. This is unexpected!';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  console.error('[METRO-ULTRA-DEBUG] Initializing resolver and extraNodeModules.');
  if (!config.resolver) {
    console.error('[METRO-ULTRA-DEBUG] config.resolver is undefined, initializing.');
    config.resolver = {};
  }
  if (!config.resolver.extraNodeModules) {
    console.error('[METRO-ULTRA-DEBUG] config.resolver.extraNodeModules is undefined, initializing.');
    config.resolver.extraNodeModules = {};
  }
  console.error('[METRO-ULTRA-DEBUG] Resolver and extraNodeModules initialized.');

  const dummyDatePickerFileName = 'dummyDatePickerIOS.js';
  const dummyDatePickerPath = path.resolve(projectRoot, dummyDatePickerFileName);
  console.error(`[METRO-ULTRA-DEBUG] Expected path for ${dummyDatePickerFileName}: ${dummyDatePickerPath}`);

  try {
    if (fs.existsSync(dummyDatePickerPath)) {
      console.error(`[METRO-ULTRA-DEBUG] SUCCESS: ${dummyDatePickerFileName} FOUND at ${dummyDatePickerPath}`);
    } else {
      const errorMessage = `[METRO-ULTRA-DEBUG] WARNING: ${dummyDatePickerFileName} NOT FOUND at ${dummyDatePickerPath}. This might lead to issues.`;
      console.error(errorMessage);
      console.error('[METRO-ULTRA-DEBUG] Continuing despite potentially missing file, as per previous findings that it is located during expo doctor.');
    }
  } catch (e) {
      console.error(`[METRO-ULTRA-DEBUG] !!! ERROR checking fs.existsSync for ${dummyDatePickerPath} !!!`);
      console.error(`[METRO-ULTRA-DEBUG] Error Message: ${e.message}`);
      console.error(`[METRO-ULTRA-DEBUG] Error Stack: ${e.stack}`);
      console.error('[METRO-ULTRA-DEBUG] Continuing after fs.existsSync error.');
  }
  
  config.resolver.extraNodeModules['react-native-date-picker'] = dummyDatePickerPath;
  console.error(`[METRO-ULTRA-DEBUG] Alias created: 'react-native-date-picker' -> ${dummyDatePickerPath}`);

  console.error('[METRO-ULTRA-DEBUG] >>> metro.config.js execution finished successfully, exporting config. <<<');
  module.exports = config;

} catch (error) {
  console.error('[METRO-ULTRA-DEBUG] !!! Unrecoverable error in metro.config.js setup !!!');
  console.error(`[METRO-ULTRA-DEBUG] Error Message: ${error.message}`);
  console.error(`[METRO-ULTRA-DEBUG] Error Stack: ${error.stack}`);
  throw error; 
}

console.error('[METRO-ULTRA-DEBUG] End of metro.config.js file reached (after module.exports or throw).');
