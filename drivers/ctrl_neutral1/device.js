'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraWallSwitchSingle extends ZigBeeDevice {

	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			getOpts: {
				pollInterval: 3000,
			},
		});
		// Register capabilities and reportListeners for Left switch
		this.registerCapability('onoff', 'genOnOff', {
			endpoint: 1
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 3, true);
	}

	// Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchOneAttrListener] Received data =', data);
		if (data > 0) {
			let currentValue = this.getCapabilityValue('onoff');
			this.log('[AqaraLightControlDouble] [switchOneAttrListener] Setting capability value to', !currentValue);
			this.setCapabilityValue('onoff', !currentValue);
		}
	}

}

module.exports = AqaraWallSwitchSingle;
