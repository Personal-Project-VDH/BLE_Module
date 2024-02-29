import {SEND_SMS} from './send_sms';
import {NativeEventEmitter, NativeModules} from 'react-native';
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from 'react-native-ble-manager';
import {consoleDebug} from './utils';
import {assignCallback, runCallback} from './callback';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const {Buffer} = require('buffer');

export class BLE extends SEND_SMS {
  constructor() {
    super();
    this.peripheral_id = 'FC:B4:67:85:2B:7A';
    this.array_service_uuid = ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'];
    this.read_characteristics = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
    this.write_characteristics = 'cba1d466-344c-4be3-ab3f-189f80dd7518';
    this.condition_scan = 'NOT_SET';
    this.timeout_scan = 10;
    this.enable_bluetooth = false;
    this.loop_read;
    this.connected_device = 0;
  }

  startModule() {
    BleManager.start({showAlert: false}).then(() => {
      consoleDebug('Module initialized', 'startModule');
      this.enableBLE();
      setTimeout(() => {
        this.connect('');
      }, 1000);
    });
  }

  stopScan() {
    BleManager.stopScan().then(() => {
      consoleDebug('Scan stopped', 'stopScan');
    });
  }

  connect(device) {
    // this.peripheral_id = device.id;
    consoleDebug(this.peripheral_id, 'this.peripheral_id');
    this.stopScan();
    if (this.connected_device > 0) return;
    BleManager.connect(this.peripheral_id).then(() => {
      // Success code
      consoleDebug('connected', this.peripheral_id, 'connect');
      this.startReadData(1000);
      this.checkConnectCMD();
      // this.retrieveService(this.peripheral_id);
    });
  }

  scanDevice() {
    if (!this.enable_bluetooth) return;
    BleManager.scan(this.array_service_uuid, this.timeout_scan, true, {
      matchMode: BleScanMatchMode.Sticky,
      scanMode: BleScanMode.Opportunistic,
      callbackType: BleScanCallbackType.AllMatches,
    })
      .then(() => {
        consoleDebug(
          '[startScan] scan promise returned successfully.',
          'scanDevice',
        );
      })
      .catch(err => {
        consoleDebug(
          '[startScan] ble scan returned in error',
          err,
          'scanDevice',
        );
      });
  }

  startReadData(time) {
    clearInterval(this.loop_read);
    this.loop_read = setInterval(() => {
      this.readBLE();
    }, time);
  }

  readBLE() {
    BleManager.read(
      this.peripheral_id,
      this.array_service_uuid[0],
      this.read_characteristics,
    )
      .then(readData => {
        const buffer = Buffer.from(readData);
        runCallback('READ', buffer.toString());
      })
      .catch(error => {
        consoleDebug(error, this.peripheral_id, 'scanDevice');
      });
  }

  checkState() {
    BleManager.checkState().then(state =>
      console.log(`current BLE state = '${state}'.`),
    );
  }

  getConnected() {
    BleManager.getConnectedPeripherals(this.array_service_uuid).then(
      peripheralsArray => {
        // Success code
        this.connected_device = peripheralsArray.length;
      },
    );
  }

  writeBLE(data_write) {
    let data = Buffer.from(data_write, 'utf8');
    consoleDebug(data_write, 'data_write');
    BleManager.write(
      this.peripheral_id,
      this.array_service_uuid[0],
      this.write_characteristics,
      data.toJSON().data,
    )
      .then(() => {})
      .catch(error => {
        consoleDebug(error, 'scanDevice');
      });
  }

  retrieveService = () => {
    BleManager.retrieveServices(this.peripheral_id).then(peripheralInfo => {
      // Success code
      consoleDebug('Peripheral info:', peripheralInfo);
    });
  };

  enableBLE() {
    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        consoleDebug('The bluetooth is already enabled or the user confirm');
        this.enable_bluetooth = true;
        this.scanDevice();
      })
      .catch(error => {
        // Failure code
        consoleDebug('The user refuse to enable bluetooth');
        this.enable_bluetooth = false;
      });
  }

  disconnectBLE = () => {
    BleManager.disconnect(this.peripheral_id)
      .then(() => {
        // Success code
        consoleDebug('Disconnected');
        clearInterval(this.loop_read);
        this.scanDevice();
        this.peripheral_id = '';
      })
      .catch(error => {
        // Failure code
        consoleDebug(error, 'disconnectBLE');
      });
  };

  conditionConnect = args => {
    let device = args;
    consoleDebug(device?.name, 'conditionConnect');
    if (device?.name === null) return;
    if (device?.name === this.condition_scan) {
      this.connect(device);
    }
  };

  listeningEvent() {
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', args => {
      this.conditionConnect(args);
    });
    bleManagerEmitter.addListener('BleManagerStopScan', args => {
      consoleDebug('stop scan', args);
      if (args.status === 10) {
        this.scanDevice();
      }
    });
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value, peripheral, characteristic, service}) => {
        // Convert bytes array to string
        const data = value;
        consoleDebug(
          `Received ${data} for characteristic ${characteristic} - ${data.toString()}`,
        );
      },
    );
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', event => {
      consoleDebug(
        `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
        this.disconnectBLE(),
      );
    });
    bleManagerEmitter.addListener('BleManagerConnectPeripheral', event => {
      consoleDebug(`[handleConnectPeripheral][${event.peripheral}] connected.`);
    });
  }

  onRead(read_function) {
    let read = {
      READ: read_function,
    };
    assignCallback(read);
  }

  setScanIden(name) {
    this.condition_scan = name;
  }

  setScanTimeout(time) {
    this.timeout_scan = time;
  }

  checkConnectCMD() {
    let obj = {
      CMD: 'PI',
    };

    setInterval(() => {
      this.writeBLE(JSON.stringify(obj));
    }, 2000);
  }
}
