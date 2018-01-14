'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraLightSwitchDouble extends ZigBeeDevice {

	onMeshInit() {

		// define and register FlowCardTriggers
		this.triggerButton2_scene = new Homey.FlowCardTriggerDevice('button2_scene');
		this.triggerButton2_scene
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.button === state.button && args.scene === state.scene);
			});

		this.triggerButton2_button = new Homey.FlowCardTriggerDevice('button2_button');
		this.triggerButton2_button
			.register();

		this._attrReportListeners['0_genOnOff'] = this._attrReportListeners['0_genOnOff'] || {};
		this._attrReportListeners['0_genOnOff']['onOff'] = this.onOnOffListener.bind(this);

		this._attrReportListeners['1_genOnOff'] = this._attrReportListeners['1_genOnOff'] || {};
		this._attrReportListeners['1_genOnOff']['onOff'] = this.onOnOffListener2.bind(this);

		this._attrReportListeners['2_genOnOff'] = this._attrReportListeners['2_genOnOff'] || {};
		this._attrReportListeners['2_genOnOff']['onOff'] = this.onOnOffListener3.bind(this);

	}
	onOnOffListener(data) {
		this.log('genOnOff - onOff', data, 'Left button');
		if (data === 0) {
			const remoteValue = {
				button: 'Left button',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}
	onOnOffListener2(data) {
		this.log('genOnOff - onOff', data, 'Right button');
		if (data === 0) {
			const remoteValue = {
				button: 'Right button',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}
	onOnOffListener3(data) {
		this.log('genOnOff - onOff', data, 'Both buttons');
		if (data === 0) {
			const remoteValue = {
				button: 'Both buttons',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}
}

module.exports = AqaraLightSwitchDouble;

// WXKG02LM
/*
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ------------------------------------------
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] Node: 1185fec2-4b26-438d-aaa9-7a54ee4486a9
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Battery: false
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 0
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genBasic
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genBasic
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genOta
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genOta
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- manuSpecificCluster
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : manuSpecificCluster
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 1
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 2
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genAnalogInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genAnalogInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ------------------------------------------
*/
