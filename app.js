'use strict';

const Homey = require('homey');
const Log = require('homey-log').Log;

class XiaomiZigbee extends Homey.App {

	onInit() {

		this.log('Xiaomi Zigbee app is running...');
		this.triggerButton1_scene = new Homey.FlowCardTriggerDevice('trigger_button1_scene');
		this.triggerButton1_scene
			.register()
			.registerRunListener((args, state) => Promise.resolve(args.scene.id === state.scene))
			.getArgument('scene')
			.registerAutocompleteListener((query, args, callback) => args.device.onSceneAutocomplete(query, args, callback));

		this.triggerButton2_scene = new Homey.FlowCardTriggerDevice('trigger_button2_scene');
		this.triggerButton2_scene
			.register()
			.registerRunListener((args, state) =>
				Promise.resolve(args.button.id === state.button && args.scene.id === state.scene));

		this.triggerButton2_scene
			.getArgument('scene')
			.registerAutocompleteListener((query, args, callback) => args.device.onSceneAutocomplete(query, args, callback));
		this.triggerButton2_scene
			.getArgument('button')
			.registerAutocompleteListener((query, args, callback) => args.device.onButtonAutocomplete(query, args, callback));

		// Register conditions for flows
		this._conditionSwitchTwo = new Homey.FlowCardCondition('ctrl_neutral2_switch2_is_on')
			.register()
			.registerRunListener((args, state) =>
				Promise.resolve(args.ctrl_neutral2.getCapabilityValue('onoff.1')));

		// Register actions for flows
		this._actionSwitchTwoOn = new Homey.FlowCardAction('ctrl_neutral2_turn_on_switch2')
			.register()
			.registerRunListener((args, state) => {
				this.log('FlowCardAction triggered to switch on');
				return args.ctrl_neutral2.triggerCapabilityListener('onoff.1', true, {});
			});

		// Register actions for flows
		this._actionSwitchTwoOn = new Homey.FlowCardAction('ctrl_neutral2_turn_off_switch2')
			.register()
			.registerRunListener((args, state) => {
				this.log('FlowCardAction triggered to switch off');
				return args.ctrl_neutral2.triggerCapabilityListener('onoff.1', false, {});
			});

	}

}

module.exports = XiaomiZigbee;