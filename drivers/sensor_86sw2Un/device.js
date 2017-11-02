'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraLightSwitchDouble extends ZigBeeDevice {

	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// define and register FlowCardTriggers
		let triggerButton2_scene = new Homey.FlowCardTriggerDevice('button2_scene');
		triggerButton2_scene
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.button === state.button && args.scene === state.scene);
			});

		let triggerButton2_button = new Homey.FlowCardTriggerDevice('button2_button');
		triggerButton2_button
			.register();

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1, data => {
			this.log('genOnOff - onOff, LEFT', data);
			// in case of one click (onOff command)
			if (data === 1) {
				const remoteValue = {
					button: '1',
					scene: 'Key Pressed 1 time',
				};
				// Trigger the trigger card with 1 dropdown option
				triggerButton2_scene.trigger(this, triggerButton2_scene.getArgumentValues, remoteValue);
				// Trigger the trigger card with tokens
				triggerButton2_button.trigger(this, remoteValue, null);
			}
		}, 1);

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1, data => {
			this.log('genOnOff - onOff, RIGHT', data === 1);
			// in case of one click (onOff command)
			if (data === 1) {
				const remoteValue = {
					button: '2',
					scene: 'Key Pressed 1 time',
				};
				// Trigger the trigger card with 1 dropdown option
				triggerButton2_scene.trigger(this, triggerButton2_scene.getArgumentValues, remoteValue);
				// Trigger the trigger card with tokens
				triggerButton2_button.trigger(this, remoteValue, null);
			}
		}, 2);

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
