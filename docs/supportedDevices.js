'use strict';

const appManifest = require('../app.json');

module.exports.parseManifest = function() {
  // console.log('app Manifest', appManifest);

  let driversManifest = appManifest.drivers;

  driversManifest = driversManifest.sort((a, b) => a._appSpecific.modelID > b._appSpecific.modelID && 1 || -1);

  const classNames = {
    sensor: 'Sensors',
    button: 'Button or wallcontrollers',
    socket: 'Built-in or plug-in socket switches',
    light: 'Lights',
    curtain: 'Curtain controllers',
  };

  // const supportedClasses = ['sensor', 'button', 'socket', 'light', 'curtain'];
  const supportedClasses = [...new Set(driversManifest.map(item => item.class))];
  // console.log('supportedClasses', supportedClasses, unique);

  // const supportedClasses = ['sensor', 'button', 'socket', 'light', 'curtain'];
  const supportedCapabilities = [...new Set(driversManifest.map(item => item.capabilities))];
  console.log('supportedCapabilities', supportedCapabilities);

  const supportedBrands = ['Aqara', 'Aqara Opple', 'Xiaomi', 'Xiaomi Honeywell'];
  // const uniqueBrands = [...new Set(driversManifest.map(item => item._appSpecific.brand))];

  console.log('| Device icon | Brand | Name  | Device modelID | Product Code (EAN) | Zigbee productId | Driver ID | Device capabilities | Subdevices | Deprecated');
  console.log('| --- | --- | --- | --- | --- | --- |  --- | --- | --- | --- |');

  for (const driverClass of supportedClasses) {
    console.log(`***${classNames[driverClass]}***|`);
    for (const deviceBrand of supportedBrands) {
      Object.keys(driversManifest).forEach(driverID => {
        const driverManifest = driversManifest[driverID];

        if (driverManifest.class === driverClass) {
          if (driverManifest._appSpecific.brand === deviceBrand) {
            let modelID = '-';
            if (driverManifest.hasOwnProperty('_appSpecific') && driverManifest._appSpecific.hasOwnProperty('modelID')) {
              modelID = driverManifest._appSpecific.modelID;
            }
            let brand = '-';
            if (driverManifest.hasOwnProperty('_appSpecific') && driverManifest._appSpecific.hasOwnProperty('brand')) {
              brand = driverManifest._appSpecific.brand;
            }

            let productCode = '-';
            if (driverManifest.hasOwnProperty('_appSpecific') && driverManifest._appSpecific.hasOwnProperty('EAN')) {
              productCode = driverManifest._appSpecific.EAN.toString().replace(/,/g, ', ');
            }

            let subDevices = 'No';
            if (driverManifest.hasOwnProperty('zigbee') && driverManifest.zigbee.hasOwnProperty('devices')) {
              subDevices = `Yes (${Object.keys(driverManifest.zigbee.devices).length})`;
            }

            const driverIcon = `<img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/${driverManifest.id}/assets/icon.svg" width="50%" height="50%">`;
            console.log(`| ${driverIcon} | ${brand} | ${driverManifest.name.en.replace('|', '-')} | ${modelID} | ${productCode} | ${driverManifest.zigbee.productId.toString().replace(/,/g, ', ')} | ${driverManifest.id} | ${driverManifest.capabilities.toString().replace(/,/g, ', ')} | ${subDevices} | ${!driverManifest.deprecated ? '' : 'Yes*'}`);
          }
        }
      });
    }
  }
  console.log('* Deprecated device drivers will still continue to function but are replaced by a new driver with extended capabilities. Re-inclusion of the device is required to benefit from these new capabilities');
};
