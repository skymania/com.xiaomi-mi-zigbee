'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraWallSwitchDouble extends ZigBeeDevice {

	async onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// Register capabilities and reportListeners for Left switch
		this.registerCapability('onoff', 'genOnOff', {
			endpoint: 1
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 1, true);

		// Register capabilities and reportListeners for Right switch
		this.registerCapability('onoff.1', 'genOnOff', {
			endpoint: 2
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchTwoAttrListener.bind(this), 2, true);

		// Register measure_power capabilities and reportListeners for Left switch
		this.registerCapability('measure_power', 'genAnalogInput', {
			get: 'presentValue',
			report: 'presentValue',
			reportParser: value => value,
		}, 6);

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 300, 1, data => {
			this.log('genAnalogInput - presentValue (power)', data);
			this.setCapabilityValue('measure_power', data);
		}, 6);

		// Register triggers for flows
		this._triggerSwitchTwoOn = new Homey.FlowCardTriggerDevice('ctrl_neutral2_switch2_turned_on').register();
		this._triggerSwitchTwoOff = new Homey.FlowCardTriggerDevice('ctrl_neutral2_switch2_turned_off').register();

	}

	/*
	switchTwoOnActionListener(args, state) {
		this.log('FlowCardAction triggered to switch on');
		this.triggerCapabilityListener('onoff.1', true);
	}

	switchTwoOffActionListener(args, state) {
		this.log('FlowCardAction triggered to switch off');
		this.triggerCapabilityListener('onoff.1', false);
	}
	*/

	// Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchOneAttrListener] Received data =', data);
		// if (data) {
		//	let currentValue = this.getCapabilityValue('onoff');
		//	this.log('[AqaraLightControlDouble] [switchOneAttrListener] Setting capability value to', data);
		this.setCapabilityValue('onoff', data === 1);
		//}
	}

	switchTwoAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchTwoAttrListener] Received data =', data);
		// if (data) {
		let currentValue = this.getCapabilityValue('onoff.1');
		// this.log('[AqaraLightControlDouble] [switchTwoAttrListener] Setting capability value to', data);
		this.setCapabilityValue('onoff.1', data === 1);
		if (currentValue !== data) {
			this[`_triggerSwitchTwo${data === 1 ? 'On' : 'Off'}`].trigger(this, {}, {}).catch(this.error);
			// data ? this._triggerSwitchTwoOn.trigger(this, {}, {}).catch(this.error) : this._triggerSwitchTwoOff.trigger(this, {}, {}).catch(this.error);
		}
		//}
	}

	/*
	// Overload parent method to trigger flows when capabilities' changes
	async _registerCapabilityListenerHandler(capabilitySetObj, capabilityId, value, opts) {
		this.log('_registerCapabilityListenerHandler triggered');
		return super._registerCapabilityListenerHandler(capabilitySetObj, capabilityId, value, opts)
			.then(res => this.switchCapabilityListener(capabilityId, value))
	}

	// method to check capabilities' changes and trigger relevant flows
	switchCapabilityListener(capabilityId, value) {
		this.log('[AqaraLightControlDouble] [switchCapabilityListener] Received capabilityId =', capabilityId, ' value = ', value);
		if (capabilityId === "onoff.1") {
			if (value === true) {
				this.log('[AqaraLightControlDouble] [switchCapabilityListener] Triggering ctrl_neutral2_switch2_turned_on');
				this._triggerSwitchTwoOn.trigger(this, {}, {});
			}
			else {
				this.log('[AqaraLightControlDouble] [switchCapabilityListener] Triggering ctrl_neutral2_switch2_turned_off');
				this._triggerSwitchTwoOff.trigger(this, {}, {});
			}
		}
	}
	*/

	// Temporary till until Zigbee Meshdriver bug is fixed. See https://github.com/athombv/homey/issues/2137
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

}

module.exports = AqaraWallSwitchDouble;

/*
Product ID: QBKG03LM
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ZigBeeDevice has been inited
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ------------------------------------------
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] Node: f0892c11-3cf9-4448-acb8-30691a9c43a3
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Battery: false
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 0
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBasic
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBasic
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- zclVersion : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- appVersion : 18
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- stackVersion : 2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- hwVersion : 38
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- manufacturerName : LUMI
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- modelId : lumi.ctrl_neutral2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- dateCode : 11-11-2016
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- powerSource : 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- locationDesc :
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genPowerCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genPowerCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- mainsVoltage : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- mainsAlarmMask : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- batteryVoltage : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genDeviceTempCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genDeviceTempCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentTemperature : 21
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- lowTempThres : 55
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- highTempThres : 60
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genIdentify
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genIdentify
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- identifyTime : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genTime
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genTime
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOta
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOta
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- count : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentScene : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentGroup : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sceneValid : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- 61440 : 53562368
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- activeText : ON
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : CHANNEL1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- inactiveText : OFF
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOffTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOnTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 67109376
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- count : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentScene : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentGroup : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sceneValid : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- activeText : ON
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : CHANNEL2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- inactiveText : OFF
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOffTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOnTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 67109377
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 3
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 5
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 6
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genAnalogInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genAnalogInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : POWER
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- maxPresentValue : 1600
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minPresentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- resolution : 1
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 590336
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ------------------------------------------
*/