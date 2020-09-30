'use strict';

const commandMap = {
  up: 0,
  idle: 2,
  down: 1,
};

const Homey = require('homey');

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');

const XiaomiBasicCluster = require('../../lib/XiaomiBasicCluster');

Cluster.addCluster(XiaomiBasicCluster);

const REPORT_DEBOUNCER = 2000;

class AqaraCurtainB1 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    // enable debugging
    // this.enableDebug();

    // Enables debug logging in zigbee-clusters
    // debug(true);

    // print the node's info to the console
    // this.printNode();

    // Add onoff capability if not available
    if (!this.hasCapability('onoff')) {
      await this.addCapability('onoff');
    }

    if (this.hasCapability('onoff')) {
      this.registerCapabilityListener('onoff', async value => {
        this.log('onoff - go to state', commandMap[value ? 'up' : 'down']);
        await zclNode.endpoints[1].clusters[CLUSTER.MULTI_STATE_OUTPUT.NAME].writeAttributes({ presentValue: commandMap[value ? 'up' : 'down'] });

        //  goToLiftPercentage({
        //  percentageLiftValue: (1 - value) * 100,
        // }, {
        // This is a workaround for the fact that this device does not repsonds with a default
        // response even though the ZCL command `goToLiftPercentage` demands that.
        //  waitForResponse: false,
        // });
      });
    }

    // this.log('CLASS:', this.getClass(), this.getClass() === 'windowcoverings');

    try {
      const { xiaomiCurtainClearPosition, xiaomiCurtainReverse, xiaomiCurtainOpenCloseManual } = await zclNode.endpoints[1].clusters[XiaomiBasicCluster.NAME].readAttributes('xiaomiCurtainClearPosition', 'xiaomiCurtainReverse', 'xiaomiCurtainOpenCloseManual');
      this.log('READ xiaomiCurtainClearPosition:', xiaomiCurtainClearPosition, 'xiaomiCurtainReverse', xiaomiCurtainReverse, 'xiaomiCurtainOpenCloseManual', xiaomiCurtainOpenCloseManual);
  		} catch (err) {
      this.error('failed to read curtain attributes', err);
    }

    if (this.hasCapability('windowcoverings_state')) {
      this.registerCapability('windowcoverings_state', CLUSTER.MULTI_STATE_OUTPUT, {
        // set: 'presentValue',
        // setParser(value) {
        //  this.log('windowcoverings_state', value, commandMap[value]);
        //  return { data: commandMap[value] };
        // },
        get: 'presentValue',
        getOpts: {
          getOnStart: true,
        },
        endpoint: 1,
      });

      this.registerCapabilityListener('windowcoverings_state', async value => {
        this.log('windowcoverings_state - go to state', commandMap[value]);
        await zclNode.endpoints[1].clusters[CLUSTER.MULTI_STATE_OUTPUT.NAME].writeAttributes({ presentValue: commandMap[value] });

        //  goToLiftPercentage({
        //  percentageLiftValue: (1 - value) * 100,
        // }, {
        // This is a workaround for the fact that this device does not repsonds with a default
        // response even though the ZCL command `goToLiftPercentage` demands that.
        //  waitForResponse: false,
        // });
      });

      /*
      this.registerCapability('windowcoverings_state', CLUSTER.WINDOW_COVERING, {
        endpoint: 1,
      });
      */
    }

    if (this.hasCapability('windowcoverings_set')) {
      // Set Position
      /*
      this.registerCapabilityListener('windowcoverings_set', async value => {
        this.log('go to lift percentage', (1 - value) * 100);
        await zclNode.endpoints[1].clusters[CLUSTER.WINDOW_COVERING.NAME].goToLiftPercentage({
          percentageLiftValue: (1 - value) * 100,
        }, {
          // This is a workaround for the fact that this device does not repsonds with a default
          // response even though the ZCL command `goToLiftPercentage` demands that.
          waitForResponse: false,
        });
      });
      */

      this.registerCapability('windowcoverings_set', CLUSTER.ANALOG_OUTPUT, {
        // set: 'presentValue',
        // setParser(value) {
        //  return value * 100;
        // },
        get: 'presentValue',
        getOpts: {
          getOnStart: true,
        },
        // report: 'presentValue',
        // reportParser(value) {
        //  this.log('reported presentValue:', value);
        //  return value / 100;
        // },

        endpoint: 1,
      });

      this.registerCapabilityListener('windowcoverings_set', async value => {
        this.log('windowcoverings_set - go to lift percentage', (1 - value) * 100);
        await zclNode.endpoints[1].clusters[CLUSTER.ANALOG_OUTPUT.NAME].writeAttributes({ presentValue: (1 - value) * 100 });

        //  goToLiftPercentage({
        //  percentageLiftValue: (1 - value) * 100,
        // }, {
        // This is a workaround for the fact that this device does not repsonds with a default
        // response even though the ZCL command `goToLiftPercentage` demands that.
        //  waitForResponse: false,
        // });
      });

      // Get Position
      zclNode.endpoints[1].clusters[CLUSTER.ANALOG_OUTPUT.NAME]
        .on('attr.presentValue', this.onCurtainPositionAttrReport.bind(this));

      // Get Position
      zclNode.endpoints[1].clusters[CLUSTER.WINDOW_COVERING.NAME]
        .on('attr.currentPositionLiftPercentage', this.onCurtainPositionAttrReport.bind(this));
    }

    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
      getOpts: {
        getOnStart: true,
      },
      endpoint: 1,
    });

    // Register the AttributeReportListener - Lifeline
    zclNode.endpoints[1].clusters[XiaomiBasicCluster.NAME]
      .on('attr.xiaomiLifeline', this.onXiaomiLifelineAttributeReport.bind(this));

    /*
    // This value is set by the system set parser in order to know whether command was sent from Homey
    this._reportDebounceEnabled = false;

    // Link util parseData method to this devices instance
    this.parseData = util.parseData.bind(this);

    // powerSource = 1 = adapter only, 3 = battery, 4 = battery + adapter
    this.node.endpoints[0].clusters.genBasic.read('powerSource')
      .then(res => {
        this.debug('Read powerSource: ', res);
      })
      .catch(err => {
        this.error('Read powerSource: ', err);
      });

    // DEFINE windowcoverings_state (open / close / idle)
    // Close command: genMultistateOutput, presentValue 0
    // Pause command: genMultistateOutput, presentValue 2
    // Open command: genMultistateOutput, presentValue 1
    this.node.endpoints[0].clusters.genMultistateOutput.read('presentValue') // 0x0055
      .then(res => {
        this.debug('Read presentValue (state): ', res);
        this.setCapabilityValue('windowcoverings_state', res / 100);
      })
      .catch(err => {
        this.error('Read presentValue (state): ', err);
      });

    if (this.hasCapability('windowcoverings_state')) {
      this.registerCapability('windowcoverings_state', 'genMultistateOutput', {
        set: 'presentValue',
        setParser(value) {
          this.log('windowcoverings_state', value, commandMap[value]);
          return { data: commandMap[value] };
        },
        get: 'presentValue',
        endpoint: 0,
      });
    }

    await this.registerCapabilityListener('windowcoverings_state', value => {
      this.log('Setting windowcoverings_state to:', value, commandMap[value]);
      this.node.endpoints[0].clusters.genMultistateOutput.write(0x0055, commandMap[value])
        .then(res => {
          this.debug('Write genMultistateOutput presentValue: ', res);
        })
        .catch(err => {
          this.error('Write genMultistateOutput presentValue: ', err);
        });
      return Promise.resolve();
    });

    // Register listener for when position changes
    await this.registerAttrReportListener('genMultistateOutput', 'presentValue', 1, 300, null, presentValue => {
      this.debug('genMultistateOutput persentValue', presentValue);

      // If reports are not generated by set command from Homey update directly
      // if (!this._reportDebounceEnabled) {
      this.node.endpoints[0].clusters.genMultistateOutput.read(0x0055)
						 .then(res => {
								 this.debug('Read presentValue (state): ', res);
								 // this.setCapabilityValue('windowcoverings_state', res / 100);
						 })
						 .catch(err => {
								 this.error('Read presentValue (state): ', err);
						 });
    });

    // DEFINE windowcoverings_set (percentage)
    this.node.endpoints[0].clusters.genAnalogOutput.read('presentValue') // presentValue
      .then(res => {
        this.debug('Read presentValue (set): ', res);
        this.setCapabilityValue('windowcoverings_set', res / 100);
      })
      .catch(err => {
        this.error('Read presentValue (set): ', err);
      });

    if (this.hasCapability('windowcoverings_set')) {
		    this.registerCapability('windowcoverings_set', 'genAnalogOutput', {
        set: 'presentValue',
		    setParser(value) {
		        return {
		            percentageliftvalue: value * 100,
		        };
		    },
        get: 'presentValue',
		    report: 'presentValue',
		    reportParser(value) {
          this.log('reported presentValue:', value);
		        return value / 100;
		    },
		    endpoint: 0,
		    getOpts: {
		        getOnStart: true,
		    },
      });
    }

    await this.registerCapabilityListener('windowcoverings_set', value => {
      this.log('Setting windowcoverings_set to:', value, value * 100);
		    const percentage = value * 100;
		    const number = Math.min(Math.max(percentage, 0), 100);
		    this.node.endpoints[0].clusters.genAnalogOutput.write(0x0055, number)
        .then(res => {
          this.debug('Write presentValue (set): ', res);
        })
        .catch(err => {
          this.error('Write presentValue (set): ', err);
        });

		    return Promise.resolve();
    });

    // Register listener for when position changes
    await this.registerAttrReportListener('genAnalogOutput', 'presentValue', 1, 300, null,
      this.onCurtainPositionAttrReport.bind(this), 0)
      .catch(err => {
        // Registering attr reporting failed
        this.error('failed to register attr report listener - genBasic - Lifeline', err);
      });

    // Listen for battery percentage updates
    this.node.endpoints[0].clusters.genPowerCfg.read('batteryPercentageRemaining') // 0x0021
      .then(res => {
        this.debug('Read battery: ', res);
        const percentage = Math.min(Math.max(res / 2, 0), 100);
        this.setCapabilityValue('measure_battery', percentage);
      })
      .catch(err => {
        this.error('Read battery: ', err);
      });

    await this.registerAttrReportListener('genPowerCfg', 'batteryPercentageRemaining', 1, 300, 0, batteryPercentage => {
	    this.debug('batteryPercentageRemaining', batteryPercentage);
	    const percentage = Math.min(Math.max(batteryPercentage / 2, 0), 100);
	    return this.setCapabilityValue('measure_battery', percentage);
    });

    // Register the AttributeReportListener - Lifeline
    this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
      this.onLifelineReport.bind(this), 0)
      .catch(err => {
        // Registering attr reporting failed
        this.error('failed to register attr report listener - genBasic - Lifeline', err);
      });
      */
  }

  async onCurtainPositionAttrReport(data) {
    this.debug('onCurtainPositionAttrReport', data);
    clearTimeout(this.curtainTernaryTimeout);

    if (data === 2) {
      this.log('onCurtainPositionAttrReport - windowcoverings_state', 'idle');
      this.setCapabilityValue('windowcoverings_state', 'idle');
    }

    // If reports are not generated by set command from Homey update directly
    if (data !== 2 && !this._reportDebounceEnabled) {
      const { presentValue } = await this.zclNode.endpoints[1].clusters[CLUSTER.ANALOG_OUTPUT.NAME].readAttributes('presentValue');
      // this.node.endpoints[0].clusters.genAnalogOutput.read(0x0055)
      // .then(res => {
      //  this.debug('Read presentValue: ', res);
      //  this.setCapabilityValue('windowcoverings_set', 1 - (res / 100));
      // })
      // .catch(err => {
      //  this.error('Read presentValue: ', err);
      // });
      // return;

      // update onOff capability
      if (this.getCapabilityValue('onoff') !== presentValue > 0) {
        this.setCapabilityValue('onoff', presentValue > 0).catch(this.error);
      }
      this.log('onCurtainPositionAttrReport - windowcoverings_set', presentValue, 1 - (presentValue / 100));
      this.setCapabilityValue('windowcoverings_set', 1 - (presentValue / 100));
    }

    // Else set debounce timeout to prevent capability value updates while moving
    if (this._reportPercentageDebounce) clearTimeout(this._reportPercentageDebounce);
    this._reportPercentageDebounce = setTimeout(() => this._reportDebounceEnabled = false, REPORT_DEBOUNCER);

    // update Ternary buttons
    this.curtainTernaryTimeout = setTimeout(() => {
      this.setCapabilityValue('windowcoverings_state', 'idle');
    }, 3000);
  }

  /**
   * This is Xiaomi's custom lifeline attribute, it contains a lot of data, af which the most
   * interesting the battery level. The battery level divided by 1000 represents the battery
   * voltage. If the battery voltage drops below 2600 (2.6V) we assume it is almost empty, based
   * on the battery voltage curve of a CR1632.
   * @param {{batteryLevel: number}} lifeline
   */
  onXiaomiLifelineAttributeReport({
    state,
  } = {}) {
    this.log('lifeline attribute report', {
      state,
    });

    if (typeof state === 'number') {
      const parsedDim = 1 - (state / 100);
      this.log('onXiaomiLifelineAttributeReport - windowcoverings_set', parsedDim);
      this.setCapabilityValue('windowcoverings_set', parsedDim);
      this.setCapabilityValue('onoff', parsedDim === 1);
    }
  }

}

module.exports = AqaraCurtainB1;

/*
Product type no: ZNCLDJ12LM
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ------------------------------------------
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] Node: f876d475-14e0-434e-be1f-396ef435c236
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] - Battery: false
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] - Endpoints: 0
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] -- Clusters:
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- zapp
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genBasic
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genBasic
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genPowerCfg
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genPowerCfg
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genIdentify
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genIdentify
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genTime
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genTime
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:25 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genAnalogOutput
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genAnalogOutput
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] --- genMultistateOutput
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : genMultistateOutput
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] --- closuresWindowCovering
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- cid : closuresWindowCovering
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ---- sid : attrs
2019-10-24 21:58:26 [log] [ManagerDrivers] [curtain.hagl04] [0] ------------------------------------------

2018-03-04 16:56:10 [log] [ManagerDrivers] [curtain] [0] lifeline report <Buffer 03 28 1e 05 21 06 00 64 20 fd 08 21 09 11 07 27 00 00 00 00 00 00 00 00 09 21 00 01>

// does require mfgCode: 0x115F in attribute write command
// clear position: genBasic, 0xff27, bool = false
// Reverse: genBasic, 0xff28, bool = true (normal), false (reverse)
// Open / close curtain manually: genBasic, 0xff29, bool = false (not manually), true (manually)
// genBasic, 0xff2A, 0

Changing settings of Curtain controller
Cluster: 	genBasic (0x0000)
Attribute: Unknown (0x0401)
Values
	Manual open/close	Direction	Operation			HEX stream
A	Enabled						Positive	Clear Stroke	0001 0000 0000 00
B	Disabled					Positive	Clear Stroke	0001 0000 0001 00
C	Enabled						Reverse		Clear Stroke	0001 0001 0000 00
D	Disabled					Reverse		Clear Stroke	0001 0001 0001 00
E	Enabled						Positive	Normal				0008 0000 0000 00
F	Disabled					Positive	Normal				0008 0000 0001 00
G	Enabled						Reverse		Normal				0008 0001 0000 00
H	Disabled					Reverse		Normal				0008 0001 0001 00

*/
