// SDK3 updated & validated: DONE

'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const {
  debug, Cluster, CLUSTER,
} = require('zigbee-clusters');

class AqaraSmartPlugEU extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
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
        endpoint: this.getClusterEndpoint(CLUSTER.ON_OFF),
      });
    }

    // measure_power
    if (this.hasCapability('measure_power')) {
      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        endpoint: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      });
    }

    if (this.hasCapability('meter_power')) {
      this.registerCapability('meter_power', CLUSTER.METERING, {
        endpoint: this.getClusterEndpoint(CLUSTER.METERING),
      });
    }

    // Try to initialize AttributeReporting for electricaMeasurement and metering clusters
    try {
      await this._configureMeterAttributeReporting({ zclNode });
    } catch (err) {
      this.error('failed to configure AttributeReporting', err);
    }
  }

  async _configureMeterAttributeReporting({ zclNode }) {
    this.debug('--  initializing attribute reporting for the electricaMeasurement cluster');

    const electricalMeasurementAttributeArray = [];

    // Define the relevant attributes to read depending on the defined capabilities and availability of the factors in the Store
    const attributesToRead = [];
    if (this.hasCapability('measure_power') && typeof this.getStoreValue('activePowerFactor') !== 'number') {
      attributesToRead.push('acPowerMultiplier', 'acPowerDivisor');
    }

    // Actually read the required attributes
    if (attributesToRead.length !== 0) {
      var attrs = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(...attributesToRead);
      this.debug('--- Read reporting divisors and multipliers:', attrs);
    }

    // Re-iterate over the different capabilities and define the required report factors, add them to the Array and store them.
    if (this.hasCapability('measure_power')) {
      if (typeof this.getStoreValue('activePowerFactor') !== 'number') {
        this.activePowerFactor = attrs.acPowerMultiplier / attrs.acPowerDivisor;
        this.setStoreValue('activePowerFactor', this.activePowerFactor);
        electricalMeasurementAttributeArray.push({
          cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
          attributeName: 'activePower',
          minInterval: 30,
          maxInterval: 300,
          minChange: 1 / this.activePowerFactor,
          endpointId: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
        });
      } else {
        this.activePowerFactor = this.getStoreValue('activePowerFactor');
      }
    }

    // When there are Attributes to be configured, configure them
    if (electricalMeasurementAttributeArray.length !== 0) {
      await this.configureAttributeReporting(electricalMeasurementAttributeArray);
    }

    this.debug('--  initializing attribute reporting for the metering cluster');
    const meteringAttributeArray = [];

    if (this.hasCapability('meter_power')) {
      if (typeof this.getStoreValue('meteringFactor') !== 'number') {
        const { multiplier, divisor } = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes('multiplier', 'divisor');
        this.meteringFactor = multiplier / divisor;
        this.setStoreValue('meteringFactor', this.meteringFactor);
        meteringAttributeArray.push({
          cluster: CLUSTER.METERING,
          attributeName: 'currentSummationDelivered',
          minInterval: 120,
          maxInterval: 300,
          minChange: 0.01 / this.meteringFactor,
          endpointId: this.getClusterEndpoint(CLUSTER.METERING),
        });
      } else {
        this.meteringFactor = this.getStoreValue('meteringFactor');
      }
    }

    if (meteringAttributeArray.length !== 0) {
      await this.configureAttributeReporting(meteringAttributeArray);
    }
  }

}

module.exports = AqaraSmartPlugEU;
/*
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ------------------------------------------
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] Node: 9c5b5186-ad44-409f-9f5e-7c99e39a2d13
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] - Battery: false
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] - Endpoints: 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] -- Clusters:
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- zapp
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genBasic
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genBasic
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- zclVersion : 3
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- appVersion : 22
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- stackVersion : 2
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- hwVersion : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- manufacturerName : LUMI
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- modelId : lumi.plug.maeu01
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- dateCode : 09-10-2019
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- powerSource : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genDeviceTempCfg
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genDeviceTempCfg
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- currentTemperature : 23
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- devTempAlarmMask : 2
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- highTempThres : 65
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- highTempDwellTripPoint : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genIdentify
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genIdentify
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- identifyTime : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genGroups
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genGroups
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- nameSupport : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genScenes
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genScenes
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- count : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- currentScene : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- currentGroup : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sceneValid : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- nameSupport : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- lastCfgBy : 0xffffffffffffffff
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genOnOff
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genOnOff
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- onOff : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- globalSceneCtrl : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genAlarms
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genAlarms
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- alarmCount : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genTime
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genTime
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genOta
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genOta
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- seMetering
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : seMetering
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- currentSummDelivered : [ 0, 136 ]
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- status : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- unitOfMeasure : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- multiplier : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- divisor : 1000
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- summaFormatting : 35
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- demandFormatting : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- meteringDeviceType : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- haElectricalMeasurement
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- 65533 : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : haElectricalMeasurement
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- measurementType : 8
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- activePower : 0
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- acPowerMultiplier : 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- acPowerDivisor : 10
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- acAlarmsMask : 4
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- acActivePowerOverload : 2300
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] - Endpoints: 1
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] -- Clusters:
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- zapp
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] --- genGreenPowerProxy
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- cid : genGreenPowerProxy
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ---- sid : attrs
2020-02-25 13:19:52 [log] [ManagerDrivers] [plug.maeu01] [0] ------------------------------------------

{ '3': 32,							= soc_temperature
  '5': 4,
  '7': 0,
  '8': 4886,
  '9': 770,
  '59': 7289341,
  '62': 103021886,
  '100': 1,
  '253': 16 }

Cluster: genBasic (0x0000)
Atribute: Unknown (0xfff0)
Data Type: Octet String (0x41), length: 9
Disabled indicator: 	aa8005d14713031001
Enabled indicator:  	aa8005d14714031000

Power failure memory
enabled:  						aa8005d1472a011001
disabled: 						aa8005d14729011000	aa8005d1472b011000

Charging protection
enabled:							aa8005d1472c021001
disabled:							aa8005d1472d021000

*/
