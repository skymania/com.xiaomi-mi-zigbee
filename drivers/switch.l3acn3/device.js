// TODO add settings + Add genMultistateOutput options (single / double tripple press)

'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const {
  debug, Cluster, CLUSTER,
} = require('zigbee-clusters');

const AqaraManufacturerSpecificCluster = require('../../lib/AqaraManufacturerSpecificCluster');

Cluster.addCluster(AqaraManufacturerSpecificCluster);

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

    // Register the AttributeReportListener - Lifeline
    zclNode.endpoints[this.getClusterEndpoint(AqaraManufacturerSpecificCluster)].clusters[AqaraManufacturerSpecificCluster.NAME]
      .on('attr.aqaraLifeline', this.onAqaraLifelineAttributeReport.bind(this));
  }

  /**
   * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
   * on the battery voltage curve of a CR1632.
   * @param {{batteryLevel: number}} lifeline
   */
  onAqaraLifelineAttributeReport({
    state, state1, state2,
  } = {}) {
    this.log('lifeline attribute report', {
      state, state1, state2,
    });

    if (typeof state === 'number') {
      this.setCapabilityValue('onoff', state === 1);
    }
  }

}

module.exports = AqaraD1WallSwitchTrippleL;

/*
Product ID: QBKG03LM
actual captured:
Left to wireless switch: endPoint 1, 0xfcc0, attrs  0x0200, type 0x20 uint8, 0 (wireless)
Middle: endpoint 2
right: endpoint 3

Zigbee2MQTT options: aqaraSwitchOperationMode, aqaraPowerOutageMemory, aqaraLedDisabled

*/
