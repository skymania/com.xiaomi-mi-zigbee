// SDK3 updated & validated: DONE

'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

class XiaomiDoorWindowSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    // Remove unused capabilities
    if (this.hasCapability('alarm_battery')) {
      await this.removeCapability('alarm_battery');
    }

    if (this.hasCapability('measure_battery')) {
      await this.removeCapability('measure_battery');
    }

    zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME]
      .on('attr.onOff', this.onContactReport.bind(this));
  }

  /**
   * This attribute is reported when the contact alarm of the door and window sensor changes.
   * @param {boolean} onOff
   */

  onContactReport(data) {
    const reverseAlarmLogic = this.getSetting('reverse_contact_alarm') || false;
    const parsedData = !reverseAlarmLogic ? data === true : data === false;
    this.log(`alarm_contact -> ${parsedData}`);
    this.setCapabilityValue('alarm_contact', parsedData);
  }

}

module.exports = XiaomiDoorWindowSensor;

// MCCGQ01LM_sensor_magnet
/*
Node overview
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] Node: 2a3902d3-988a-4ae5-adea-6e0d7c85ec5e
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] - Battery: false
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] - Endpoints: 0
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] -- Clusters:
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- zapp
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genBasic
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genBasic
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genIdentify
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genIdentify
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genGroups
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genGroups
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genScenes
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genScenes
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genOnOff
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genOnOff
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genLevelCtrl
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genLevelCtrl
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genOta
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genOta
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- manuSpecificCluster
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : manuSpecificCluster
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ------------------------------------------
*/
