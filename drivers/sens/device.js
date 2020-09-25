// SDK3 updated & validated : DONE

'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

const XiaomiBasicCluster = require('../../lib/XiaomiBasicCluster');

Cluster.addCluster(XiaomiBasicCluster);

class XiaomiTempSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    zclNode.endpoints[1].clusters[CLUSTER.BASIC.NAME]
      .on('attr.xiaomiLifeline', this.onXiaomiLifelineAttributeReport.bind(this));

    zclNode.endpoints[1].clusters[CLUSTER.TEMPERATURE_MEASUREMENT.NAME]
      .on('attr.measuredValue', this.onTemperatureMeasuredAttributeReport.bind(this));

    zclNode.endpoints[1].clusters[CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT.NAME]
      .on('attr.measuredValue', this.onRelativeHumidityMeasuredAttributeReport.bind(this));
  }

  /**
   * Set `measure_temperature` when a `measureValue` attribute report is received on the
   * temperature measurement cluster.
   * @param {number} measuredValue
   */
  onTemperatureMeasuredAttributeReport(measuredValue) {
    const temperatureOffset = this.getSetting('temperature_offset') || 0;
    const parsedValue = this.getSetting('temperature_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
    this.log('measure_temperature | msTemperatureMeasurement - measuredValue (temperature):', parsedValue, '+ temperature offset', temperatureOffset);
    this.setCapabilityValue('measure_temperature', parsedValue + temperatureOffset);
  }

  /**
   * Set `measure_humidity` when a `measureValue` attribute report is received on the relative
   * humidity measurement cluster.
   * @param {number} measuredValue
   */
  onRelativeHumidityMeasuredAttributeReport(measuredValue) {
    const humidityOffset = this.getSetting('humidity_offset') || 0;
    const parsedValue = this.getSetting('humidity_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
    this.log('measure_humidity | msRelativeHumidity - measuredValue (humidity):', parsedValue, '+ humidity offset', humidityOffset);
    this.setCapabilityValue('measure_humidity', parsedValue + humidityOffset);
  }

  /**
   * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
   * on the battery voltage curve of a CR1632.
   * @param {{batteryLevel: number}} lifeline
   */
  onXiaomiLifelineAttributeReport({
    state, state1, batteryVoltage,
  } = {}) {
    this.log('lifeline attribute report', {
      batteryVoltage, state, state1,
    });

    if (typeof state === 'number') this.onTemperatureMeasuredAttributeReport(state);
    if (typeof state1 === 'number') this.onRelativeHumidityMeasuredAttributeReport(state1);
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

module.exports = XiaomiTempSensor;

// WSDCGQ01LM_sens
/*
Node overview:
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ------------------------------------------
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] Node: 78db4c1a-5cde-4f65-b68c-42ba2832ca3e
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] - Battery: false
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] - Endpoints: 0
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- zapp
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genBasic
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- 65281 : !�
                                                                     !�!>$d)�e!�
!
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genBasic
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- modelId : lumi.sensor_ht
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genGroups
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genScenes
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genMultistateInput
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genMultistateInput
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genOta
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genOta
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- manuSpecificCluster
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : manuSpecificCluster
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] - Endpoints: 1
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- zapp
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genGroups
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genScenes
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genMultistateInput
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genMultistateInput
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] - Endpoints: 2
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- zapp
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2018-03-03 16:56:10 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] --- genGroups
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] --- genScenes
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] --- genAnalogInput
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- cid : genAnalogInput
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2018-03-03 16:56:11 [log] [ManagerDrivers] [sens] [0] ------------------------------------------

*/
