'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWallSwitchSingleLN extends ZigBeeDevice {

	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// Register capabilities and reportListeners for  switch
		this.registerCapability('onoff', 'genOnOff', {
			endpoint: 1
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 1, true);
	}

	// Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('Received data =', data);
		this.setCapabilityValue('onoff', data === 1);
	}

}

module.exports = AqaraWallSwitchSingleLN;

/*
Product ID: QBKG11LM
*/