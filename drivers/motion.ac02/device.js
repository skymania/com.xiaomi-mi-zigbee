// SDK3 updated & validated

'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

const util = require('../../lib/util');
const AqaraManufacturerSpecificCluster = require('../../lib/AqaraManufacturerSpecificCluster');

Cluster.addCluster(AqaraManufacturerSpecificCluster);

class AqaraHumanBodySensorP1 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {

    // enable debugging
    //this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(false);

    // print the node's info to the console
    //this.printNode();

    if (this.isFirstInit()) {
      try {
        await zclNode.endpoints[1].clusters[AqaraManufacturerSpecificCluster.NAME].writeAttributes({ mode: 1 }).catch(this.error);
      } catch (err) {
        this.error('failed to write mode attributes', err);
      }
    }

    try {
      const {
        aqaraSensitivityLevel, aqaraMotionRetriggerInterval, aqaraMotionLed
      } = await this.zclNode.endpoints[this.getClusterEndpoint(AqaraManufacturerSpecificCluster)]
        .clusters[AqaraManufacturerSpecificCluster.NAME]
        .readAttributes('aqaraSensitivityLevel', 'aqaraMotionRetriggerInterval', 'aqaraLedInverted').catch(this.error);
      this.log('READattributes options ', aqaraSensitivityLevel, aqaraMotionRetriggerInterval, Boolean(aqaraMotionLed));
      await this.setSettings({ alarm_motion_reset_window: aqaraMotionRetriggerInterval, trigger_motion_led: aqaraMotionLed }).catch(this.error);
    } catch (err) {
      this.log('could not read Attributes:', err);
    }

    // occupancy and illumination detection
    zclNode.endpoints[1].clusters[AqaraManufacturerSpecificCluster.NAME]
      .on('attr.aqaraMotionAndIllumination', this.onMotionAndLuminanceMeasuredValueAttributeReport.bind(this));

    // lifeline report
    zclNode.endpoints[1].clusters[AqaraManufacturerSpecificCluster.NAME]
      .on('attr.aqaraLifeline', this.onAqaraLifelineAttributeReport.bind(this));
  }

  /**
   * Set `measure_luminance` when a `measureValue` attribute report is received on the measure
   * luminance cluster.
   * @param {number} measuredValue
   */
  onMotionAndLuminanceMeasuredValueAttributeReport(measuredValue) {
    // set illuminance value 
    if (typeof measuredValue === 'number') {
      this.log('handle report (cluster: IlluminanceMeasurement, attribute: measuredValue, capability: measure_luminance), parsed payload:', measuredValue);
      this.setCapabilityValue('measure_luminance', measuredValue).catch(this.error);
    }
    
    // register motion 
    this.log('handle report (cluster: OccupancySensing, attribute: -, capability: alarm_motion), parsed payload: n/a');
    this.setCapabilityValue('alarm_motion', true).catch(this.error);

    // set and clear motion timeout
    const alarmMotionResetWindow = (this.getSetting('alarm_motion_reset_window') || 200);
    // set a timeout after which the alarm_motion capability is reset
    if (this.motionAlarmTimeout) clearTimeout(this.motionAlarmTimeout);

    this.motionAlarmTimeout = setTimeout(() => {
      this.log('manual alarm_motion reset');
      this.setCapabilityValue('alarm_motion', false).catch(this.error);
    }, alarmMotionResetWindow * 1000);

    // trigger interval 
    this.setCapabilityValue('trigger_interval', this.getSetting('alarm_motion_reset_window')).catch(this.error);

    // motion sensitvity 
    this.setCapabilityValue('motion_sensitivity', this.getSetting('motion_sensitivity_level')).catch(this.error);

    // motion led 
    this.setCapabilityValue('motion_led', this.getSetting('trigger_motion_led')).catch(this.error);
  }

  /**
   * This is Aqara's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage.
   * @param {{batteryLevel: number}} lifeline
   */
  onAqaraLifelineAttributeReport({
    state, state1, batteryVoltage
  } = {}) {
    // Motion
    if (typeof state === 'boolean') {
      this.log('handle report (cluster: AqaraManufacturerSpecificCluster, attribute: state, capability: alarm_motion), parsed payload:', state);
      this.log('onAqaraLifelineAttributeReport - motion', state);
    }
    // Illumination
    if (typeof state1 === 'number') {
      this.log('handle report (cluster: AqaraManufacturerSpecificCluster, attribute: state1, capability: measure_luminance), parsed payload:', state1);
      this.setCapabilityValue('measure_luminance', state1).catch(this.error);
    }
    // Battery
    if (typeof batteryVoltage === 'number') {
      const parsedBatPct = util.calculateBatteryPercentage(batteryVoltage, '3V_2850_3000');
      if (this.hasCapability('measure_battery')) {
        this.log(`handle report (cluster: AqaraLifeline, attribute: batteryVoltage, capability: measure_battery), parsed payload:`, parsedBatPct);
        this.setCapabilityValue('measure_battery', parsedBatPct).catch(this.error);
      }

      if (this.hasCapability('alarm_battery')) {
        this.log(`handle report (cluster: AqaraLifeline, attribute: batteryVoltage, capability: alarm_battery), parsed payload:`, parsedBatPct < 20);
        this.setCapabilityValue('alarm_battery', parsedBatPct < 20).catch(this.error);
      }
    }
  }

  /**
   * Update settings
   * @param {*} param0 
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    try {
      // reverse_direction attribute
      if (changedKeys.includes('alarm_motion_reset_window')) {
        const result = await this.zclNode.endpoints[this.getClusterEndpoint(AqaraManufacturerSpecificCluster)].clusters[AqaraManufacturerSpecificCluster.NAME]
          .writeAttributes({ aqaraMotionRetriggerInterval: newSettings.alarm_motion_reset_window }).catch(this.error);
        this.log('SETTINGS | Write Attribute - Aqara Manufacturer Specific Cluster - aqaraMotionRetriggerInterval', newSettings.alarm_motion_reset_window, 'result:', result);
      }
      if (changedKeys.includes('motion_sensitivity_level')) {
        const result = await this.zclNode.endpoints[this.getClusterEndpoint(AqaraManufacturerSpecificCluster)].clusters[AqaraManufacturerSpecificCluster.NAME]
          .writeAttributes({ aqaraSensitivityLevel: newSettings.motion_sensitivity_level }).catch(this.error);
        this.log('SETTINGS | Write Attribute - Aqara Manufacturer Specific Cluster - aqaraSensitivityLevel', newSettings.motion_sensitivity_level, 'result:', result);
      }
      if (changedKeys.includes('trigger_motion_led')) {
        const result = await this.zclNode.endpoints[this.getClusterEndpoint(AqaraManufacturerSpecificCluster)].clusters[AqaraManufacturerSpecificCluster.NAME]
          .writeAttributes({ aqaraMotionLed: newSettings.trigger_motion_led }).catch(this.error);
        this.log('SETTINGS | Write Attribute - Aqara Manufacturer Specific Cluster - aqaraMotionLed', newSettings.trigger_motion_led, 'result:', result);
      }
    } catch (err) {
      // reset settings values on failed update
      throw new Error("failed to update settings. Message:" + err);

    }
  }
}

module.exports = AqaraHumanBodySensorP1;