'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWallSwitchDoubleLN extends ZigBeeDevice {

	async onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		// Register capabilities and reportListeners for Left switch
		this.registerCapability('onoff', 'genOnOff', {
			endpoint: 0
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 0, true);

		// Register capabilities and reportListeners for Right switch
		this.registerCapability('onoff.1', 'genOnOff', {
			endpoint: 1
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchTwoAttrListener.bind(this), 1, true);

		// measure_power switch
		// applicationType : 589824 = 0x090000 Power in Watts
		// Register measure_power capability
		if (this.hasCapability('measure_power')) {
			this.registerCapability('measure_power', 'genAnalogInput', {
				get: 'presentValue',
				report: 'presentValue',
				reportParser: value => {
					this.log('genAnalogInput - presentValue (power)', value);
					return value;
				},
				endpoint: 2
			});

			// Report is send if status is changed or after 5 min
			this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, data => {
				this._debug('genAnalogInput - presentValue (power)', data); // due to amount of data reported, only logged in debug mode
				this.setCapabilityValue('measure_power', data);
			}, 2);
		}

		// meter_power switch
		// applicationType : 720896 = 0x0B0000 Energy in kWH
		// Register meter_power capability
		if (this.hasCapability('meter_power')) {
			this.registerCapability('meter_power', 'genAnalogInput', {
				get: 'presentValue',
				getOpts: {
					pollInterval: 600000, // maps to device settings
				},
				report: 'presentValue',
				reportParser: value => {
					this.log('genAnalogInput - presentValue (meter)', value);
					return value;
				},
				endpoint: 3
			});

			// Report is send if status is changed or after 5 min
			this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, data => {
				this.log('genAnalogInput - presentValue (meter)', data);
				this.setCapabilityValue('meter_power', data);
			}, 3);
		}

		// measure_voltage
		if (this.hasCapability('measure_voltage')) {
			this.registerCapability('measure_voltage', 'genPowerCfg', {
				get: 'mainsVoltage',
				getOpts: {
					pollInterval: 600000, // maps to device settings
				},
				report: 'mainsVoltage',
				reportParser: value => {
					this.log('genAnalogInput - mainsVoltage', value / 10);
					return value / 10;
				},
				endpoint: 0,
			});
		}

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this._debug('registered attr report listener - genBasic - Lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

	}

	onLifelineReport(value) {
		this._debug('parsedData', new Buffer(value, 'ascii'));

		const parsedData = this.parseData(new Buffer(value, 'ascii'));
		this._debug('parsedData', parsedData);

		// state (onoff) switch 1 (ID 100)
		if (parsedData.hasOwnProperty('100')) {
			const parsedOnOff = parsedData['100'] === 1;
			this.log('lifeline - onoff state (switch 1)', parsedOnOff);
			this.setCapabilityValue('onoff', parsedOnOff);
		}
		// state (onoff) switch 2 (ID 101)
		if (parsedData.hasOwnProperty('101')) {
			const parsedOnOff = parsedData['101'] === 1;
			this.log('lifeline - onoff state (switch 2)', parsedOnOff);
			this.setCapabilityValue('onoff.1', parsedOnOff);
		}

	}

	// Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('genOnOff - onOff (switch 1):', data);
		this.setCapabilityValue('onoff', data === 1);
	}

	switchTwoAttrListener(data) {
		this.log('genOnOff - onOff (switch 2):', data);
		let currentValue = this.getCapabilityValue('onoff.1');
		this.setCapabilityValue('onoff.1', data === 1);
		if (currentValue !== (data === 1)) {
			Homey.app[`_triggerSwitchTwoTurned${data === 1 ? 'On' : 'Off'}`].trigger(this, {}, {}).catch(this.error);
		}
	}

	// <<<< Temporary till until Zigbee Meshdriver bug is fixed.
	// See https://github.com/athombv/homey/issues/2137
	// Rewrite parent method to overcome Zigbee Meshdriver bug.
	_mergeSystemAndUserOpts(capabilityId, clusterId, userOpts) {

		// Merge systemOpts & userOpts
		let systemOpts = {};

		let tempCapabilityId = capabilityId;
		let index = tempCapabilityId.lastIndexOf('.');
		if (index !== -1) {
			tempCapabilityId = tempCapabilityId.slice(0, index)
		}

		try {
			systemOpts = Homey.util.recursiveDeepCopy(require(`../../node_modules/homey-meshdriver/lib/zigbee/system/capabilities/${tempCapabilityId}/${clusterId}.js`));

			// Bind correct scope
			for (let i in systemOpts) {
				if (systemOpts.hasOwnProperty(i) && typeof systemOpts[i] === 'function') {
					systemOpts[i] = systemOpts[i].bind(this);
				}
			}
		}
		catch (err) {
			if (err.code !== 'MODULE_NOT_FOUND' || err.message.indexOf(`../../node_modules/homey-meshdriver/lib/zigbee/system/capabilities/${tempCapabilityId}/${clusterId}.js`) < 0) {
				process.nextTick(() => {
					throw err;
				});
			}
		}

		// Insert default endpoint zero
		if (userOpts && !userOpts.hasOwnProperty('endpoint')) userOpts.endpoint = this.getClusterEndpoint(clusterId);
		else if (typeof userOpts === 'undefined') userOpts = {
			endpoint: this.getClusterEndpoint(clusterId)
		};

		this._capabilities[capabilityId][clusterId] = Object.assign(
			systemOpts || {},
			userOpts || {}
		);
	}
	// >>>>
}

module.exports = AqaraWallSwitchDoubleLN;

/*
Product ID: QBKG12LM
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ------------------------------------------
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] Node: 1466ceaa-ceca-4a03-b088-f2ed973982d5
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Battery: false
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 0
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBasic
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 65281 : de(�9�9��$:!�!'	!
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBasic
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- zclVersion : 1
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- appVersion : 31
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- stackVersion : 2
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- hwVersion : 18
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- manufacturerName : LUMI
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- modelId : lumi.ctrl_ln2.aq1
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- dateCode : 10-12-2017
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- powerSource : 1
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genPowerCfg
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genPowerCfg
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- mainsVoltage : 2240
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genDeviceTempCfg
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genDeviceTempCfg
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- currentTemperature : 22
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genIdentify
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genIdentify
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- identifyTime : 0
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genGroups
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genGroups
2018-05-16 22:26:49 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- nameSupport : 128
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genScenes
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genScenes
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- count : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- currentScene : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- currentGroup : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sceneValid : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- nameSupport : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- lastCfgBy : 0xffffffffffffffff
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genOnOff
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 61440 : 117440737
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genOnOff
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- onOff : 0
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genTime
2018-05-16 22:26:50 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genTime
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBinaryOutput
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBinaryOutput
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genOta
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genOta
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:51 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 1
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genOnOff
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 61440 : 117440743
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genOnOff
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- onOff : 0
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBinaryOutput
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBinaryOutput
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 2
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:52 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:53 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genGroups
2018-05-16 22:26:53 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genGroups
2018-05-16 22:26:53 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:53 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genAnalogInput
2018-05-16 22:26:53 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 261 : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 262 : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genAnalogInput
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- applicationType : 589824
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 3
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genAnalogInput
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 261 : 0
2018-05-16 22:26:54 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- 262 : 0
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genAnalogInput
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0.0006293333135545254
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- applicationType : 720896
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 4
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBinaryOutput
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBinaryOutput
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:55 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genMultistateInput
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genMultistateInput
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- numberOfStates : 6
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 1
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 5
2018-05-16 22:26:56 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:57 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:57 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBinaryOutput
2018-05-16 22:26:57 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBinaryOutput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genMultistateInput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genMultistateInput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- numberOfStates : 6
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 1
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] - Endpoints: 6
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] -- Clusters:
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- zapp
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genBinaryOutput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genBinaryOutput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] --- genMultistateInput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- cid : genMultistateInput
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- sid : attrs
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- numberOfStates : 6
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- outOfService : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- presentValue : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ---- statusFlags : 0
2018-05-16 22:26:58 [log] [ManagerDrivers] [ctrl_ln2.aq1] [0] ------------------------------------------
*/
