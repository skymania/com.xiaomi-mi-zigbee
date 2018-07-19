'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraPlug extends ZigBeeDevice {

	onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// OnOff capability
		this.registerCapability('onoff', 'genOnOff');

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, data => {
			if (this.getCapabilityValue('onoff') !== (data === 1)) {
				this.log('genOnOff - onOff', data);
				this.setCapabilityValue('onoff', data === 1);
			}
		}, 0);

		// measure_power
		// applicationType : 589824 = 0x090000 Power in Watts
		// Register measure_power capability
		if (this.hasCapability('measure_power')) {
			this.registerCapability('measure_power', 'genAnalogInput', {
				get: 'presentValue',
				report: 'presentValue',
				reportParser: value => value,
			}, 1);
		}

		// meter_power
		// applicationType : 720896 = 0x0B0000 Energy in kWH
		// Register meter_power capability
		if (this.hasCapability('meter_power')) {
			this.registerCapability('meter_power', 'genAnalogInput', {
				get: 'presentValue',
				report: 'presentValue',
				reportParser: value => value,
			}, 2);
		}

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 300, 10, data => {
			// this.log('genAnalogInput - presentValue (power)', data);
			this.setCapabilityValue('measure_power', data);
		}, 1);

		// meter_power
		// Register onoff capability
		this.registerCapability('meter_power', 'genAnalogInput', {
			get: 'presentValue',
			report: 'presentValue',
			reportParser: value => value,
		}, 2);

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 300, 1800, 1, data => {
			this.log('genAnalogInput - presentValue (meter)', data);
			this.setCapabilityValue('meter_power', data);
		}, 2);

		// measure_voltage

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
		this.log('parsedData', new Buffer(value, 'ascii'));
		/*
		const parsedData = parseData(new Buffer(value, 'ascii'));
		this.log('parsedData', parsedData);

		// battery reportParser (ID 1)
		const parsedVolts = parsedData['1'] / 100.0;
		const minVolts = 2.5;
		const maxVolts = 3.0;

		const parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
		this.log('lifeline - battery', parsedBatPct);
		if (this.hasCapability('measure_battery') && this.hasCapability('alarm_battery')) {
			// Set Battery capability
			this.setCapabilityValue('measure_battery', parsedBatPct);
			// Set Battery alarm if battery percentatge is below 20%
			this.setCapabilityValue('alarm_battery', parsedBatPct < (this.getSetting('battery_threshold') || 20));
		}

		// Luminance reportParser (ID 100)
		// const parsedLuminance = (parsedData['100']);
		// this.log('lifeline - luminacen', parsedLuminance);
		// this.setCapabilityValue('measure_luminance', parsedLuminance);

		function parseData(rawData) {
			const data = {};
			let index = 0;
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				index += byteLength + 2;
			}
			return data;
		}
		*/
	}
}

module.exports = AqaraPlug;
/*
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ZigBeeDevice has been inited
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ------------------------------------------
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] Node: c1c03f62-2f9a-4109-99f7-49357bf29be4
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] - Battery: false
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] - Endpoints: 0
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] -- Clusters:
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] --- zapp
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] --- genBasic
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- cid : genBasic
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- zclVersion : 1
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- appVersion : 22
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- stackVersion : 2
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- hwVersion : 18
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- manufacturerName : LUMI
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- modelId : lumi.plug
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- dateCode : 02-28-2017
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- powerSource : 1
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] --- genPowerCfg
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- cid : genPowerCfg
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- mainsVoltage : 2310
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- mainsAlarmMask : 0
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] --- genDeviceTempCfg
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- cid : genDeviceTempCfg
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- currentTemperature : 25
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- lowTempThres : 55
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- highTempThres : 60
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] --- genIdentify
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- cid : genIdentify
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:49 [log] [ManagerDrivers] [plug] [0] ---- identifyTime : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- nameSupport : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genScenes
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genScenes
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- count : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- currentScene : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- currentGroup : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sceneValid : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- nameSupport : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- lastCfgBy : 0xffffffffffffffff
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genOnOff
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- 61440 : 61443584
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genOnOff
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- onOff : 1
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genTime
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genTime
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genBinaryOutput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genBinaryOutput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- activeText :
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- inactiveText :
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- outOfService : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- presentValue : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- statusFlags : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genOta
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genOta
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] - Endpoints: 1
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] -- Clusters:
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- zapp
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genAnalogInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- 261 : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- 262 : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genAnalogInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- maxPresentValue : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- outOfService : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- presentValue : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- statusFlags : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- applicationType : 589824
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] - Endpoints: 2
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] -- Clusters:
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- zapp
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genAnalogInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- 261 : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- 262 : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genAnalogInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- maxPresentValue : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- outOfService : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- presentValue : 0.00019502778013702482
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- statusFlags : 0
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- applicationType : 720896
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] - Endpoints: 3
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] -- Clusters:
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- zapp
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genGroups
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] --- genBinaryInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- cid : genBinaryInput
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ---- sid : attrs
2018-01-14 09:13:50 [log] [ManagerDrivers] [plug] [0] ------------------------------------------

{ '3': 32,							= soc_temperature
  '5': 4,
  '7': 0,
  '8': 4886,
  '9': 770,
  '59': 7289341,
  '62': 103021886,
  '100': 1,
  '253': 16 }

Cluster: genBasic (0x0000)
Atribute: Unknown (0xfff0)
Data Type: Octet String (0x41), length: 9
Disabled indicator: 	aa8005d14713031001
Enabled indicator:  	aa8005d14714031000

Power failure memory
enabled:  						aa8005d1472a011001
disabled: 						aa8005d14729011000	aa8005d1472b011000

Charging protection
enabled:							aa8005d1472c021001
disabled:							aa8005d1472d021000

*/