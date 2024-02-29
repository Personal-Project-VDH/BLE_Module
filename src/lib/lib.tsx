declare module 'SendSMSKiosk' {
  class BLE {
    constructor();
    infor_array: any[];
    phone_array: any[];
    peripheral_id: String;
    array_service_uuid: String[];
    read_characteristics: String;
    write_characteristics: String;
    condition_scan: String;
    timeout_scan: number;
    enable_bluetooth: boolean;
    loop_read: any;

    startModule(): void;
    stopScan(): void;
    connect(device: any): void;
    scanDevice(): void;
    startReadData(time: number): void;
    readBLE(): void;
    writeBLE(data_write: string): void;
    retrieveService(): void;
    enableBLE(): void;
    disconnectBLE(peripheral_id: string): void;
    conditionConnect(args: any): void;
    listeningEvent(): void;
    onRead(read_function: (data: string) => void): void;
    setScanIden(name: String): void;
    setScanTimeout(time: String): void;
  }
  export {BLE};
}
