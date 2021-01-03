// SDK3 updated & validated: DONE

'use strict';

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const {
  debug, Cluster, CLUSTER,
} = require('zigbee-clusters');

const XiaomiBasicCluster = require('../../lib/XiaomiBasicCluster');

Cluster.addCluster(XiaomiBasicCluster);

class AqaraD1WallSwitchTripleLN extends ZigBeeDevice {

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

    // measure_power switch
    // applicationType : 589824 = 0x090000 Power in Watts
    // Register measure_power capability

    // measure_power
    if (this.hasCapability('measure_power')) {
      // Define acPower parsing factor based on device settings
      if (typeof this.getStoreValue('activePowerFactor') !== 'number') {
        try {
          const { acPowerMultiplier, acPowerDivisor } = await zclNode.endpoints[this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes('acPowerMultiplier', 'acPowerDivisor');
          this.activePowerFactor = acPowerMultiplier / acPowerDivisor;
          this.setStoreValue('activePowerFactor', this.activePowerFactor);
          this.debug('SET activePowerFactor:', acPowerMultiplier, acPowerDivisor, this.activePowerFactor);
        } catch (err) {
          this.debug('Could not read electricaMeasurementCluster attributes `acPowerMultiplier`, `acPowerDivisor`:', err);
          this.activePowerFactor = 0.1; // default value
          this.debug('DEFAULT activePowerFactor:', this.activePowerFactor);
        }
      } else {
        this.activePowerFactor = this.getStoreValue('activePowerFactor');
        this.debug('READ activePowerFactor:', this.activePowerFactor);
      }

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 5, // Minimum interval of 5 seconds
            maxInterval: 300, // Maximally every ~16 hours
            minChange: 1 / this.activePowerFactor, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
      });
    }

    if (this.hasCapability('meter_power')) {
      // Define acPower parsing factor based on device settings
      if (typeof this.getStoreValue('meteringFactor') !== 'number') {
        try {
          const { multiplier, divisor } = await zclNode.endpoints[this.getClusterEndpoint(CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes('multiplier', 'divisor');
          this.meteringFactor = multiplier / divisor;
          this.setStoreValue('meteringFactor', this.meteringFactor);
          this.debug('SET meteringFactor:', multiplier, divisor, this.meteringFactor);
        } catch (err) {
          this.debug('could not read meteringCluster attributes `multiplier` and `divisor`:', err);
          this.meteringFactor = 0.001; // default value
          this.debug('DEFAULT meteringFactor:', this.meteringFactor);
        }
      } else {
        this.meteringFactor = this.getStoreValue('meteringFactor');
        this.debug('READ activePowerFactor:', this.meteringFactor);
      }

      this.registerCapability('meter_power', CLUSTER.METERING, {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 300, // Minimum interval of 5 minutes
            maxInterval: 3600, // Maximally every ~16 hours
            minChange: 0.01 / this.meteringFactor, // Report when value changed by 5
          },
        },
        endpoint: this.getClusterEndpoint(CLUSTER.METERING),
      });
    }

    // Register the AttributeReportListener - Lifeline

    // zclNode.endpoints[1].clusters[XiaomiBasicCluster.NAME]
    //  .on('attr.xiaomiLifeline', this.onXiaomiLifelineAttributeReport.bind(this));
  }

  /**
   * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
   * on the battery voltage curve of a CR1632.
   * @param {{batteryLevel: number}} lifeline
   */
  onXiaomiLifelineAttributeReport({
    state, state1,
  } = {}) {
    this.log('lifeline attribute report', {
      state, state1,
    });

    if (typeof state === 'number') {
      this.setCapabilityValue('onoff', state === 1);
    }

    if (typeof state1 === 'number') {
      this.setCapabilityValue('onoff.1', state1 === 1);
    }
  }

}

module.exports = AqaraD1WallSwitchTripleLN;

/*
Product ID: QBKG12LM
*/
