'use strict';
const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWirelessSwitch extends ZigBeeDevice {
	onMeshInit() {
		// define and register FlowCardTriggers
		this.triggerButton1_scene = new Homey.FlowCardTriggerDevice('button1_scene');
		this.triggerButton1_scene
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.scene === state.scene);
			});
		this.triggerButton1_button = new Homey.FlowCardTriggerDevice('button1_button');
		this.triggerButton1_button
			.register();

		this.registerAttrReportListener('genOnOff', 0x8000, 1, 3600, 1, this.onOnOffListener.bind(this), 0);
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1, this.onOnOffListener.bind(this), 0);
	}

	onOnOffListener(data) {
		this.log('genOnOff - onOff', data);
		const remoteValue = {
			scene: 'Key Pressed 1 time',
		};
		// Trigger the trigger card with 1 dropdown option
		this.triggerButton1_scene.trigger(this, this.triggerButton1_scene.getArgumentValues, remoteValue);
		// Trigger the trigger card with tokens
		this.triggerButton1_button.trigger(this, remoteValue, null);
	}
}
module.exports = AqaraWirelessSwitch;

// WXKG11LM_sensor_switch.aq2
/*
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ------------------------------------------
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] Node: 31956e48-9b41-47f5-a9b3-66ca8e09c15c
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] - Battery: false
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] - Endpoints: 0
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] -- Clusters:
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- zapp
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genBasic
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genBasic
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genGroups
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genGroups
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genOnOff
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genOnOff
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- manuSpecificCluster
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : manuSpecificCluster
2017-10-20 23:44:54 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2017-10-20 23:44:56 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ------------------------------------------
*/
