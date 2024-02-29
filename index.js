/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
export {BLE} from './src/ble';
AppRegistry.registerComponent(appName, () => App);
