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

const exclusionList = require('metro-config/src/defaults/exclusionList');
const nodeLibs = require('node-libs-react-native');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { resolver: { sourceExts, assetExts } } = defaultConfig;

  const updatedSourceExts = sourceExts.includes('cjs') ? sourceExts : [...sourceExts, 'cjs'];

  const originalGetTransformOptions = defaultConfig.transformer.getTransformOptions;

  // Restore react-native-svg-transformer
  defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

  defaultConfig.transformer.getTransformOptions = async (
    entryPoints,
    metroTransformerOptions, // Contains { dev, hot, platform, projectRoot, ... }
    getDependenciesOf
  ) => {
    console.log('Cascade Debug: metroTransformerOptions received by getTransformOptions:', JSON.stringify(metroTransformerOptions, null, 2));
    // Specifically log the platform value
    console.log('Cascade Debug: metroTransformerOptions.platform:', metroTransformerOptions.platform);

    const baseOptions = await originalGetTransformOptions(
  ) => {
    const baseOptions = await originalGetTransformOptions(
      entryPoints,
      metroTransformerOptions,
      getDependenciesOf
    );

    // Ensure platform and other critical options from metroTransformerOptions
    // are explicitly passed to the preset's options
    return {
      ...baseOptions, // Spread base options (transformer-level options)
      transform: { // Options for the Babel preset (metro-react-native-babel-preset)
        ...baseOptions.transform, // Spread any options already in baseOptions.transform
        experimentalImportSupport: false,
        inlineRequires: true,
        // Explicitly add/override platform, dev, hot, projectRoot for the preset
        // These are taken directly from what Metro provides to getTransformOptions
        platform: metroTransformerOptions.platform,
        dev: metroTransformerOptions.dev,
        hot: metroTransformerOptions.hot,
        projectRoot: metroTransformerOptions.projectRoot,
      },
    };
  };

  defaultConfig.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
  defaultConfig.resolver.sourceExts = updatedSourceExts;
  defaultConfig.resolver.blockList = exclusionList([/^(?!.*node_modules).*\/(amplify|src\/graphql)\/.*$/]);

  const defaultExtraNodeModules = defaultConfig.resolver.extraNodeModules || {};
  delete defaultExtraNodeModules.fs;

  defaultConfig.resolver.extraNodeModules = {
    ...defaultExtraNodeModules,
    ...nodeLibs,
    // 'make-plural' and 'crypto-ld' are handled by resolveRequest
    'react-native-date-picker': path.resolve(__dirname, 'dummyDatePickerIOS.js'),
    '@mattrglobal/bbs-signatures': path.resolve(__dirname, 'node_modules/@mattrglobal/bbs-signatures/lib/index.js'), // Use main entry point
  };

  defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'make-plural') {
      // console.log(`Metro resolveRequest: 'make-plural' -> plurals.js`);
      return {
        filePath: path.resolve(__dirname, 'node_modules/make-plural/plurals.js'),
        type: 'sourceFile',
      };
    }

    if (moduleName === 'crypto-ld') {
      // console.log(`Metro resolveRequest: 'crypto-ld' -> lib/index.js`);
      return {
        filePath: path.resolve(__dirname, 'node_modules/crypto-ld/lib/index.js'),
        type: 'sourceFile',
      };
    }

    if (moduleName === 'fs') {
      // console.log(`Metro resolveRequest: 'fs' -> dummyFs.js`);
      const resolvedPath = path.resolve(__dirname, 'dummyFs.js');
      return {
        filePath: resolvedPath,
        type: 'sourceFile',
      };
    }

    if (moduleName === './Libraries/Components/DrawerAndroid/DrawerLayoutAndroid' &&
        context.originModulePath &&
        context.originModulePath.endsWith('node_modules/react-native/index.js')) {
      // console.log(`Metro resolveRequest: RN DrawerLayoutAndroid -> dummyDrawerLayoutAndroid.js`);
      return {
        filePath: path.resolve(__dirname, 'dummyDrawerLayoutAndroid.js'),
        type: 'sourceFile',
      };
    }

    if (moduleName === './Libraries/Components/DatePicker/DatePickerIOS' &&
        context.originModulePath &&
        context.originModulePath.endsWith('node_modules/react-native/index.js')) {
      // console.log(`Metro resolveRequest: RN DatePickerIOS -> dummyDatePickerIOS.js`);
      return {
        filePath: path.resolve(__dirname, 'dummyDatePickerIOS.js'),
        type: 'sourceFile',
      };
    }

    return context.resolveRequest(context, moduleName, platform);
  };

  return defaultConfig;
})();
