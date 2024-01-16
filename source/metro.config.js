const { createMetroConfiguration } = require('expo-yarn-workspaces');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = createMetroConfiguration(projectRoot);

config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')];

config.resolver.extraNodeModules = {
    ...require('node-libs-react-native'),
    ...config.resolver.extraNodeModules,
};

config.resolver.sourceExts = ['js', 'ts', 'tsx', 'mjs', 'cjs'];

config.transformer.babelTransformerPath = require.resolve('react-native-react-bridge/lib/plugin');

config.resetCache = true;

config.server = {
    rewriteRequestUrl: (url) => {
        if (!url.endsWith('.bundle')) {
            return url;
        }
        return url + '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true';
    },
};

module.exports = config;
