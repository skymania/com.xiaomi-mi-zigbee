// SDK3 updated: DONE

'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const {
  debug, Cluster, CLUSTER,
} = require('zigbee-clusters');

class AqaraD1WallSwitchTrippleL extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    const { subDeviceId } = this.getData();

    let onOffEndpoint = 1;
    if (subDeviceId === 'middleSwitch') onOffEndpoint = 2;
    if (subDeviceId === 'rightSwitch') onOffEndpoint = 3;

    // Register capabilities and reportListeners for Left or Right switch
    if (this.hasCapability('onoff')) {
      this.debug('Register OnOff capability:', subDeviceId, onOffEndpoint);
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        endpoint: onOffEndpoint,
      });
    }
  }

}

module.exports = AqaraD1WallSwitchTrippleL;

/*
Product ID: QBKG03LM

Left button to a wireless switch:
Cluster: genBasic (0x0000)
Atribute: Unknown (0xff22) 65314
Data Type: 8-bit unsigned (0x20)
	disabled (regular switch): 18
	enabled: 254

Right button to a wireless switch:
Cluster: genBasic (0x0000)
Atribute: Unknown (0xff23) 65315
Data Type: 8-bit unsigned (0x20)
	disabled (regular switch): 18
	enabled: 254

When converted to a wireless switch:
Cluster: genOnOff (0x0006)
Atribute: onOff (0x0000)
1x click: Double attribute (off (0x00) + on (0x01))
2x click: data value 2 (0x02)
Hold: Off (0x00)
Release: ON (0x01)
*/
