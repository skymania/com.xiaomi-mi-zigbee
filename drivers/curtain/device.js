'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/bspranger/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-aqara-door-window-sensor.src/xiaomi-aqara-door-window-sensor.groovy
//  fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003",
// outClusters: "0000, 0004",
// manufacturer: "LUMI", model: "lumi.sensor_magnet.aq2", deviceJoinName: "Xiaomi Aqara Door Sensor"

class AqaraCurtain extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		this.registerCapability('onoff', 'genOnOff');
		/*

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, data =>
		{
			if (this.getCapabilityValue('onoff') != (data == 1))
			{
				this.log('genOnOff - onOff', data);
				this.setCapabilityValue('onoff', data == 1);
			}
		}, 0);

		this.registerReportListener('genOnOff', 'onOff', report => {
			this.log(report);
		}, 0);*/

		/*
		this.registerCapability('alarm_water', 'genOta', {
			report: 'onOff',
			reportParser(value) {
				return value;
			},
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 6000, 1, data => {
			this.log('onOff', data);
			this.setCapabilityValue('alarm_water', data === 1);
		}, 0);*/

		if (this.hasCapability('windowcoverings_state')) {
			this.registerCapability('windowcoverings_state', 'closuresWindowCovering', {
				set: 'windowCoveringMode',
				setParser(value) {
					this.log(value);
				},
				reportParser(value) {
					this.log('value: ', value);
					// return Buffer.from(value).readUIntBE(0, 2) / 1000;
				},
				report: 'windowCoveringMode',
				// getOpts: {
				//	getOnStart: true,
				//},
			});
		}

		// upOpen	server	[]
		// downClose	server	[]
		// stop	server	[]
		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genBasic - Lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});
	}

	onLifelineReport(value) {
		this.log('lifeline report', new Buffer(value, 'ascii'));
		const parsedData = parseData(new Buffer(value, 'ascii'));
		this.log('parsedData', parsedData);

		function parseData(rawData) {
			const data = {};
			let index = 0;
			// let byteLength = 0
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				// extract the relevant objects (1) Battery, (100) Temperature, (101) Humidity
				// if ([1, 100, 101].includes(rawData.readUInt8(index))) {
				data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				//}
				index += byteLength + 2;
			}
			return data;
		}
	}
}

module.exports = AqaraCurtain;

/*
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] ZigBeeDevice has been inited
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] ------------------------------------------
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] Node: 22ef4c02-70b1-4f0d-835d-91be0d09a66f
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] - Battery: false
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] - Endpoints: 0
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] -- Clusters:
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] --- zapp
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] --- genBasic
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] ---- cid : genBasic
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:48 [log] [ManagerDrivers] [curtain] [0] ---- zclVersion : 1
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- appVersion : 9
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- stackVersion : 2
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- hwVersion : 17
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- manufacturerName : LUMI
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- modelId : lumi.curtain
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- dateCode : 04-13-2017
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- powerSource : 1
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genPowerCfg
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genPowerCfg
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- mainsVoltage : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- mainsAlarmMask : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genIdentify
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genIdentify
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- identifyTime : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genGroups
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genGroups
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- nameSupport : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genScenes
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genScenes
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- count : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- currentScene : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- currentGroup : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sceneValid : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- nameSupport : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- lastCfgBy : 0xffffffffffffffff
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genOnOff
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genOnOff
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- onOff : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genTime
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genTime
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genAnalogOutput
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genAnalogOutput
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- maxPresentValue : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- minPresentValue : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- outOfService : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- presentValue : 255
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- statusFlags : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genMultistateOutput
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genMultistateOutput
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- numberOfStates : 6
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- outOfService : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- presentValue : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- statusFlags : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- genOta
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : genOta
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- closuresWindowCovering
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- 19 : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : closuresWindowCovering
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- windowCoveringType : 4
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- configStatus : 123
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- currentPositionLiftPercentage : 255
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- installedOpenLimitLiftCm : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- installedClosedLimitLiftCm : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- installedOpenLimitTiltDdegree : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- windowCoveringMode : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] --- msOccupancySensing
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- cid : msOccupancySensing
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- occupancy : 0
2018-03-04 16:12:50 [log] [ManagerDrivers] [curtain] [0] ---- occupancySensorType : 0
2018-03-04 16:12:51 [log] [ManagerDrivers] [curtain] [0] ------------------------------------------

2018-03-04 16:56:10 [log] [ManagerDrivers] [curtain] [0] lifeline report <Buffer 03 28 1e 05 21 06 00 64 20 fd 08 21 09 11 07 27 00 00 00 00 00 00 00 00 09 21 00 01>
*/
