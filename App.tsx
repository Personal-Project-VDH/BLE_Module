import React, {useEffect} from 'react';

import {View} from 'react-native';
import {BLE} from './src/ble';
import {requestPermission} from './src/RequestPermission';

function App(): React.JSX.Element {
  var _BLE = new BLE();
  useEffect(() => {
    let obj = (data: any) => {
      if (data) {
        _BLE.startModule();
        _BLE.setScanIden('ESP32test');

        let read = (data: any) => {
          console.log(data);
          try {
            console.log(JSON.parse(data), 'parse');
          } catch (error) {}
        };
        _BLE.onRead(read);

        _BLE.setScanTimeout(10);
      }
    };
    requestPermission(obj);
    _BLE.listeningEvent();
  }, []);

  return <View></View>;
}

export default App;
