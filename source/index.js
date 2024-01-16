import { registerRootComponent } from 'expo';
import 'node-libs-react-native/globals.js';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'reflect-metadata';
import 'text-encoding';
import App from './App';
import config from './src/config/agent';

console.log('Agent Config:', JSON.stringify(config, null, 2));

registerRootComponent(App);
