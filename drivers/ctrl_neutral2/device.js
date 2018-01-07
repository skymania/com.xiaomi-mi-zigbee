/*
Node: 686b5c46-3be5-4b73-bb9e-14b3f2e09876
- Battery: false
- Endpoints: 0
-- Clusters:
--- zapp
--- genBasic
---- 65281 : den o !�(!!&!�#�!
---- cid : genBasic
---- sid : attrs
---- zclVersion : 0
---- appVersion : 18
---- stackVersion : 2
---- hwVersion : 38
---- manufacturerName : LUMI
---- modelId : lumi.ctrl_neutral2
---- dateCode : 11-11-2016
---- powerSource : 4
---- locationDesc :
--- genPowerCfg
---- cid : genPowerCfg
---- sid : attrs
---- mainsVoltage : 0
---- mainsAlarmMask : 0
---- batteryVoltage : 0
--- genDeviceTempCfg
---- cid : genDeviceTempCfg
---- sid : attrs
---- currentTemperature : 29
---- lowTempThres : 55
---- highTempThres : 60
--- genIdentify
---- cid : genIdentify
---- sid : attrs
---- identifyTime : 0
--- genTime
---- cid : genTime
---- sid : attrs
--- genOta
---- cid : genOta
---- sid : attrs
- Endpoints: 1
-- Clusters:
--- zapp
--- genGroups
---- cid : genGroups
---- sid : attrs
---- nameSupport : 128
--- genScenes
---- cid : genScenes
---- sid : attrs
---- count : 0
---- currentScene : 0
---- currentGroup : 0
---- sceneValid : 0
---- nameSupport : 128
--- genOnOff
---- 61440 : 55253733
---- cid : genOnOff
---- sid : attrs
---- onOff : 0
--- genBinaryOutput
---- cid : genBinaryOutput
---- sid : attrs
---- activeText : ON
---- description : CHANNEL1
---- inactiveText : OFF
---- minimumOffTime : 500000
---- minimumOnTime : 500000
---- outOfService : 0
---- presentValue : 0
---- statusFlags : 0
---- applicationType : 67109376
- Endpoints: 2
-- Clusters:
--- zapp
--- genGroups
---- cid : genGroups
---- sid : attrs
---- nameSupport : 128
--- genScenes
---- cid : genScenes
---- sid : attrs
---- count : 0
---- currentScene : 0
---- currentGroup : 0
---- sceneValid : 0
---- nameSupport : 128
--- genOnOff
---- 61440 : 55253727
---- cid : genOnOff
---- sid : attrs
---- onOff : 0
--- genBinaryOutput
---- cid : genBinaryOutput
---- sid : attrs
---- activeText : ON
---- description : CHANNEL2
---- inactiveText : OFF
---- minimumOffTime : 500000
---- minimumOnTime : 500000
---- outOfService : 0
---- presentValue : 0
---- statusFlags : 0
---- applicationType : 67109377
- Endpoints: 3
-- Clusters:
--- zapp
--- genOnOff
---- cid : genOnOff
---- sid : attrs
---- onOff : 1
--- genMultistateInput
---- cid : genMultistateInput
---- sid : attrs
---- numberOfStates : 4
---- outOfService : 0
---- presentValue : 0
---- statusFlags : 0
- Endpoints: 4
-- Clusters:
--- zapp
--- genOnOff
---- cid : genOnOff
---- sid : attrs
---- onOff : 1
--- genMultistateInput
---- cid : genMultistateInput
---- sid : attrs
---- numberOfStates : 4
---- outOfService : 0
---- presentValue : 0
---- statusFlags : 0
- Endpoints: 5
-- Clusters:
--- zapp
--- genOnOff
---- cid : genOnOff
---- sid : attrs
---- onOff : 0
--- genMultistateInput
---- cid : genMultistateInput
---- sid : attrs
---- numberOfStates : 4
---- outOfService : 0
---- presentValue : 0
---- statusFlags : 0
- Endpoints: 6
-- Clusters:
--- zapp
--- genAnalogInput
---- cid : genAnalogInput
---- sid : attrs
---- description : POWER
---- maxPresentValue : 1600
---- minPresentValue : 0
---- outOfService : 0
---- presentValue : 0
---- resolution : 1
---- statusFlags : 0
---- applicationType : 590336
*/

'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraLightControlDouble extends ZigBeeDevice {

	onMeshInit() {
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register capabilities
		this.registerCapability('onoff', 'genOnOff', { endpoint: 1});
		this.registerCapability('onoff.1', 'genOnOff', { endpoint: 2});

		// Register triggers for flows
		this._triggerSwitchTwoOn = new Homey.FlowCardTriggerDevice('ctrl_neutral2_switch2_turned_on').register();
		this._triggerSwitchTwoOff = new Homey.FlowCardTriggerDevice('ctrl_neutral2_switch2_turned_off').register();

		// Register conditions for flows
		this._conditionSwitchTwo = new Homey.FlowCardCondition("ctrl_neutral2_switch2_is_on").register()
			.registerRunListener((args, state) => {return Promise.resolve(this.getCapabilityValue('onoff.1'));})

		// Register actions for flows
		this._actionSwitchTwoOn = new Homey.FlowCardAction('ctrl_neutral2_turn_on_switch2').register()
			.registerRunListener((args, state) => {return this.triggerCapabilityListener('onoff.1', true, {});});
		this._actionSwitchTwoOff = new Homey.FlowCardAction('ctrl_neutral2_turn_off_switch2').register()
			.registerRunListener((args, state) => {return this.triggerCapabilityListener('onoff.1', false, {});});

		// Register listeners for attributes
		this.registerAttrReportListener('genOnOff', 'onOff',1, 3600, 1,
			this.switchOneAttrListener.bind(this),3, true);
		this.registerAttrReportListener('genOnOff', 'onOff',1, 3600, 1,
			this.switchTwoAttrListener.bind(this),4, true);

	}

  // Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchOneAttrListener] Received data =' , data);
		if (data > 0) {
			let currentValue = this.getCapabilityValue('onoff');
			this.log('[AqaraLightControlDouble] [switchOneAttrListener] Setting capability value to', !currentValue);
			this.setCapabilityValue('onoff', !currentValue);
		}
	}

	switchTwoAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchTwoAttrListener] Received data =' , data);
		if (data > 0) {
			let currentValue = this.getCapabilityValue('onoff.1');
			this.log('[AqaraLightControlDouble] [switchTwoAttrListener] Setting capability value to', !currentValue);
			this.setCapabilityValue('onoff.1', !currentValue);
			if (!currentValue === true) this._triggerSwitchTwoOn.trigger(this,{},{}).catch( this.error );
			else this._triggerSwitchTwoOff.trigger(this,{},{}).catch( this.error );
		}
	}

  // Overload parent method to trigger flows when capabilities' changes
	async _registerCapabilityListenerHandler(capabilitySetObj, capabilityId, value, opts) {
		return super._registerCapabilityListenerHandler(capabilitySetObj, capabilityId, value, opts)
		.then(res => this.switchCapabilityListener(capabilityId, value))
	}

  // method to check capabilities' changes and trigger relevant flows
  switchCapabilityListener(capabilityId, value) {
		this.log('[AqaraLightControlDouble] [switchCapabilityListener] Received capabilityId =', capabilityId, ' value = ', value);
		if (capabilityId === "onoff.1") {
			if (value === true) {
				this.log('[AqaraLightControlDouble] [switchCapabilityListener] Triggering ctrl_neutral2_switch2_turned_on');
				this._triggerSwitchTwoOn.trigger(this,{},{});
			} else {
				this.log('[AqaraLightControlDouble] [switchCapabilityListener] Triggering ctrl_neutral2_switch2_turned_off');
				this._triggerSwitchTwoOff.trigger(this,{},{});
			}
		}
	}

	// Temporary till until Zigbee Meshdriver bug is fixed. See https://github.com/athombv/homey/issues/2137
	// Rewrite parent method to overcome Zigbee Meshdriver bug.
	_mergeSystemAndUserOpts(capabilityId, clusterId, userOpts) {

		// Merge systemOpts & userOpts
		let systemOpts = {};

		let tempCapabilityId = capabilityId;
		let index = tempCapabilityId.lastIndexOf('.');
		if (index!==-1) {
			tempCapabilityId = tempCapabilityId.slice(0,index)
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

module.exports = AqaraLightControlDouble;
