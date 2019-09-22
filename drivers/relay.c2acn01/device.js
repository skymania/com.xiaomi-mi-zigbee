'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraDoubleRelay extends ZigBeeDevice {

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
				endpoint: 0
			});

			// Report is send if status is changed or after 5 min
			this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, data => {
				this._debug('genAnalogInput - presentValue (power)', data); // due to amount of data reported, only logged in debug mode
				this.setCapabilityValue('measure_power', data);
			}, 0);
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

module.exports = AqaraDoubleRelay;

/*
Product ID: LLKZMK11LM
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ZigBeeDevice has been inited
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ------------------------------------------
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] Node: 42c7e365-10d0-4108-8ce6-d475cf81efe9
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] - Battery: false
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] - Endpoints: 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] -- Clusters:
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- zapp
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genBasic
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genBasic
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- zclVersion : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- appVersion : 35
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- stackVersion : 2
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- hwVersion : 18
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- manufacturerName : LUMI
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- modelId : lumi.relay.c2acn01
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- dateCode : 09-20-2018
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- powerSource : 4
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- locationDesc :
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- alarmMask : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genPowerCfg
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genPowerCfg
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- mainsVoltage : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- mainsAlarmMask : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- batteryVoltage : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genDeviceTempCfg
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genDeviceTempCfg
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- currentTemperature : 33
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- lowTempThres : 45
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- highTempThres : 60
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genIdentify
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genIdentify
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- identifyTime : 0
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genGroups
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genGroups
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- nameSupport : 128
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genScenes
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genScenes
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:29 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- count : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- currentScene : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- currentGroup : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sceneValid : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- nameSupport : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- lastCfgBy : 0xffffffffffffffff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genOnOff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genOnOff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- onOff : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genTime
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genTime
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- time : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- timeStatus : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genAnalogInput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genAnalogInput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- description : CHANN
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- maxPresentValue : 2500
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- outOfService : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- presentValue : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- statusFlags : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genBinaryOutput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genBinaryOutput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- activeText : ON
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- description : CHANNEL1
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- inactiveText : OFF
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- minimumOffTime : 100000
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- minimumOnTime : 100000
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- outOfService : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- presentValue : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- statusFlags : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- applicationType : 67109376
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genOta
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genOta
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- haElectricalMeasurement
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : haElectricalMeasurement
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- measurementType : 1
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- acFrequency : 65535
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- rmsVoltage : 65535
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- rmsCurrent : 65535
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- activePower : -1
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- powerFactor : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] - Endpoints: 1
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] -- Clusters:
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- zapp
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genGroups
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genGroups
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- nameSupport : 128
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genScenes
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genScenes
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- count : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- currentScene : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- currentGroup : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sceneValid : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- nameSupport : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- lastCfgBy : 0xffffffffffffffff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genOnOff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genOnOff
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- onOff : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] --- genBinaryOutput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- cid : genBinaryOutput
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- sid : attrs
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- activeText : ON
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- description : CHANNEL2
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- inactiveText : OFF
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- minimumOffTime : 100000
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- minimumOnTime : 100000
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- outOfService : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- presentValue : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- statusFlags : 0
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ---- applicationType : 67109377
2019-09-15 22:03:30 [log] [ManagerDrivers] [relay.c2acn01] [0] ------------------------------------------
*/
