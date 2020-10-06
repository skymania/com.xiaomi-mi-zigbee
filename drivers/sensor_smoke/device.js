'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

const XiaomiBasicCluster = require('../../lib/XiaomiBasicCluster');

Cluster.addCluster(XiaomiBasicCluster);

class AqaraSensorSmoke extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    // Capture the zoneStatusChangeNotification
    zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME]
      .onZoneStatusChangeNotification = payload => {
        this.onIASZoneStatusChangeNoficiation(payload);
      };

    // Register the AttributeReportListener - Lifeline
    zclNode.endpoints[1].clusters[XiaomiBasicCluster.NAME]
      .on('attr.xiaomiLifeline', this.onXiaomiLifelineAttributeReport.bind(this));
  }

  /**
   * Update alarm capabilities based on the IASZoneStatusChangeNotification.
   */
  onIASZoneStatusChangeNoficiation({
    zoneStatus, extendedStatus, zoneId, delay,
  }) {
    this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
    this.setCapabilityValue('alarm_smoke', zoneStatus.alarm1);
    this.setCapabilityValue('alarm_battery', zoneStatus.battery);
  }

  /**
		 * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
		 * interesting the battery level. The battery level divided by 1000 represents the battery
		 * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
		 * on the battery voltage curve of a CR1632.
		 * @param {{batteryLevel: number}} lifeline
		 */
  onXiaomiLifelineAttributeReport({
    batteryVoltage, state,
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

module.exports = AqaraSensorSmoke;
