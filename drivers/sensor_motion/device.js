// SDK3 updated & validated: DONE
// ADD: attributes: <Buffer 05 00 42 12 6c 75 6d 69 2e 73 65 6e 73 6f 72 5f 6d 6f 74 69 6f 6e>

'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

const XiaomiBasicCluster = require('../../lib/XiaomiBasicCluster');

Cluster.addCluster(XiaomiBasicCluster);

class XiaomiHumanBodySensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    zclNode.endpoints[1].clusters[CLUSTER.OCCUPANCY_SENSING.NAME]
      .on('attr.occupancy', this.onOccupancyAttributeReport.bind(this));

    // zclNode.endpoints[1].clusters[CLUSTER.BASIC.NAME]
    zclNode.endpoints[1].clusters[XiaomiBasicCluster.NAME]
      .on('attr.xiaomiLifeline', this.onXiaomiLifelineAttributeReport.bind(this));
  }

  /**
   * When an occupancy attribute report is received `alarm_motion` is set true. After the
   * timeout has expired (and no motion has been detected since) the `alarm_motion` is set false.
   * @param {boolean} occupied - True if motion is detected
   */
  onOccupancyAttributeReport({ occupied }) {
    this.log('occupancy attribute report', occupied);

    this.setCapabilityValue('alarm_motion', occupied).catch(this.error);

    // Set and clear motion timeout
    const alarmMotionResetWindow = this.getSetting('hacked_alarm_motion_reset_window') ? 5 : (this.getSetting('alarm_motion_reset_window') || 300);
    // Set a timeout after which the alarm_motion capability is reset
    if (this.motionAlarmTimeout) clearTimeout(this.motionAlarmTimeout);

    this.motionAlarmTimeout = setTimeout(() => {
      this.log('manual alarm_motion reset');
      this.setCapabilityValue('alarm_motion', false).catch(this.error);
    }, alarmMotionResetWindow * 1000);
  }

  /**
   * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
   * on the battery voltage curve of a CR1632.
   * @param {{batteryLevel: number}} lifeline
   */
  onXiaomiLifelineAttributeReport({
    batteryVoltage,
  } = {}) {
    this.log('lifeline attribute report', {
      batteryVoltage,
    });

    if (typeof batteryVoltage === 'number') {
      const parsedVolts = batteryVoltage / 1000;
      const minVolts = 2.5;
      const maxVolts = 3.0;
      const parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
      this.setCapabilityValue('measure_battery', parsedBatPct);
      this.setCapabilityValue('alarm_battery', batteryVoltage < 2600).catch(this.error);
    }
  }

}

module.exports = XiaomiHumanBodySensor;

// RTCGQ01LM_sensor_motion
/*
2017-11-01 20:09:07 [log] [ManagerDrivers] [sensor_motion.aq2] [0] msIlluminanceMeasurement - measuredValue 2 2
2017-11-01 20:09:07 [log] [ManagerDrivers] [sensor_motion.aq2] [0] msOccupancySensing - occupancy true
2017-11-01 20:09:27 [log] [ManagerDrivers] [sensor_motion] [0] ZigBeeDevice has been inited
2017-11-01 20:09:27 [log] [ManagerDrivers] [sensor_motion] [0] ------------------------------------------
2017-11-01 20:09:27 [log] [ManagerDrivers] [sensor_motion] [0] Node: 9e63104b-648b-4dd2-acd7-264775e16e63
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] - Battery: false
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] - Endpoints: 0
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] -- Clusters:
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- zapp
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genBasic
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genBasic
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genIdentify
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genIdentify
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genGroups
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genGroups
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genScenes
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genScenes
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genOnOff
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genOnOff
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genLevelCtrl
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genLevelCtrl
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- genOta
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : genOta
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] --- manuSpecificCluster
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- cid : manuSpecificCluster
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ---- sid : attrs
2017-11-01 20:09:28 [log] [ManagerDrivers] [sensor_motion] [0] ------------------------------------------
*/
