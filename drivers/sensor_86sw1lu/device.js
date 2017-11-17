'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraLightSwitchSingle extends ZigBeeDevice {

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

		this._attrReportListeners['0_genOnOff'] = this._attrReportListeners['0_genOnOff'] || {};
		this._attrReportListeners['0_genOnOff']['onOff'] = this.onOnOffListener.bind(this);
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

module.exports = AqaraLightSwitchSingle;
