'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/a4refillpad/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-zigbee-button.src/xiaomi-zigbee-button.groovy
// fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003",
// outClusters: "0000(Basic), 0004(Groups), 0003(Identify), 0006(On/Off), 0008(Level Control), 0005(Scenes)",
// manufacturer: "LUMI", model: "lumi.sensor_switch", deviceJoinName: "Xiaomi Button"

/*
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] - Battery: false
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] - Endpoints: 0
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] -- Clusters:
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] --- zapp
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] --- genBasic
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- cid : genBasic
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- sid : attrs
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] --- genGroups
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- cid : genGroups
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- sid : attrs
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] --- genOnOff
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- cid : genOnOff
2017-10-01 12:30:06 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- sid : attrs
2017-10-01 12:30:07 [log] [ManagerDrivers] [aqara_wireless_switch] [0] --- manuSpecificCluster
2017-10-01 12:30:07 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- cid : manuSpecificCluster
2017-10-01 12:30:07 [log] [ManagerDrivers] [aqara_wireless_switch] [0] ---- sid : attrs
*/

class AqaraWirelessSwitch extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();
		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			/*
			getOpts: {
				pollInterval: 10000,
			},
			*/
		}, 0);

		// Button (1x) genOnOff OnOff endpoint 1
		// Button (2-3x) genOnOff Unknown endpoint 1 Uint8
		// this.registerReportListener('genOnOff', 'OnOff', report => {
		//	console.log(report);
		//}, 1);

	}
}

module.exports = AqaraWirelessSwitch;
