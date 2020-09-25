// SDK3 updated & validated: DONE

'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const {
  zclNode, debug, Cluster, CLUSTER,
} = require('zigbee-clusters');

class XiaomiSmartPlugEU extends ZigBeeDevice {

  onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0, // No minimum reporting interval
            maxInterval: 43200, // Maximally every ~12 hours
            minChange: 1, // Report when value changed by 5
          },
        },
        endpoint: 1,
      });
    }

    // measure_power
    if (this.hasCapability('measure_power')) {
      this.registerCapability('measure_power', CLUSTER.ANALOG_INPUT, {
        get: 'presentValue',
        getOpts: {
          getOnStart: true,
        },
        report: 'presentValue',
        reportParser(value) {
          return value;
        },
        endpoint: 21,
      });
    }

    if (this.hasCapability('meter_power')) {
      this.registerCapability('meter_power', CLUSTER.ANALOG_INPUT, {
        get: 'presentValue',
        getOpts: {
          getOnStart: true,
        },
        report: 'presentValue',
        reportParser(value) {
          return value;
        },
        endpoint: 22,
      });
    }
  }

}

module.exports = XiaomiSmartPlugEU;
/*
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ------------------------------------------
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] Node: ffabe1c8-373b-4974-9d5f-37f9c63bd2be
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] - Battery: false
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] - Endpoints: 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] -- Clusters:
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- 64704
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 247 : d(�9�9�~Y>�9�E�9!�!'	!
                                                                                                  �
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 519 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : 64704
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- zapp
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genBasic
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genBasic
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- zclVersion : 3
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- appVersion : 22
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- stackVersion : 2
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- hwVersion : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- manufacturerName : LUMI
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- modelId : lumi.plug.mmeu01
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- dateCode : 09-06-2019
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- powerSource : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genDeviceTempCfg
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genDeviceTempCfg
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- currentTemperature : 30
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- devTempAlarmMask : 2
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- highTempThres : 65
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- highTempDwellTripPoint : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genIdentify
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genIdentify
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- identifyTime : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genGroups
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genGroups
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- nameSupport : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genScenes
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genScenes
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- count : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- currentScene : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- currentGroup : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sceneValid : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- nameSupport : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- lastCfgBy : 0xffffffffffffffff
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genOnOff
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 245 : 50331392
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genOnOff
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- onOff : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- globalSceneCtrl : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genTime
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genTime
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genOta
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genOta
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] - Endpoints: 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] -- Clusters:
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- zapp
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genAnalogInput
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genAnalogInput
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- outOfService : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- presentValue : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- statusFlags : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- applicationType : 589824
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] - Endpoints: 2
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] -- Clusters:
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- zapp
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genAnalogInput
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- 65533 : 1
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genAnalogInput
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- outOfService : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- presentValue : 0.21239805221557617
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- statusFlags : 0
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- applicationType : 720896
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] - Endpoints: 3
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] -- Clusters:
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- zapp
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] --- genGreenPowerProxy
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- cid : genGreenPowerProxy
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ---- sid : attrs
2020-02-25 20:33:25 [log] [ManagerDrivers] [plug.mmeu01] [0] ------------------------------------------
*/
