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
			endpoint: 0
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 0, true);
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
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ------------------------------------------
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] Node: 897c2809-5948-4025-bbfe-877e2c9b51b4
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] - Battery: false
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] - Endpoints: 0
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] -- Clusters:
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- zapp
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genBasic
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genBasic
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- zclVersion : 1
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- appVersion : 31
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- stackVersion : 2
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- hwVersion : 18
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- manufacturerName : LUMI
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- modelId : lumi.ctrl_ln1.aq1
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- dateCode : 10-11-2017
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- powerSource : 1
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genPowerCfg
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genPowerCfg
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- mainsVoltage : 2244
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genDeviceTempCfg
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genDeviceTempCfg
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:47 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- currentTemperature : 25
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genIdentify
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genIdentify
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- identifyTime : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genGroups
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genGroups
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- nameSupport : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genScenes
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genScenes
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- count : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- currentScene : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- currentGroup : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sceneValid : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- nameSupport : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- lastCfgBy : 0xffffffffffffffff
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genOnOff
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genOnOff
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- onOff : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genTime
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genTime
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genBinaryOutput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genBinaryOutput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- outOfService : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- presentValue : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- statusFlags : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genOta
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genOta
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] - Endpoints: 1
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] -- Clusters:
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- zapp
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genGroups
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genGroups
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genAnalogInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- 261 : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- 262 : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genAnalogInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- outOfService : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- presentValue : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- statusFlags : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- applicationType : 589824
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] - Endpoints: 2
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] -- Clusters:
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- zapp
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genAnalogInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- 261 : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- 262 : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genAnalogInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- outOfService : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- presentValue : 0.0034527250099927187
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- statusFlags : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- applicationType : 720896
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] - Endpoints: 3
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] -- Clusters:
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- zapp
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genBinaryOutput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genBinaryOutput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- outOfService : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- presentValue : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- statusFlags : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] --- genMultistateInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- cid : genMultistateInput
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- sid : attrs
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- numberOfStates : 6
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- outOfService : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- presentValue : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ---- statusFlags : 0
2018-07-16 18:47:48 [log] [ManagerDrivers] [ctrl_ln1.aq1] [0] ------------------------------------------
*/