'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraPlug extends ZigBeeDevice {

	onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		// OnOff capability
		this.registerCapability('onoff', 'genOnOff');

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, null, data => {
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
				getOpts: {
					// getOnStart: true, // get the initial value on app start (only use for non-battery devices)
					// pollInterval: 30000 // maps to device settings
					// getOnOnline: true, // use only for battery devices
				},
				report: 'presentValue',
				reportParser: value => {
					this._debug('genAnalogInput - presentValue (power)', value); // due to amount of data reported, only logged in debug mode
					return value;
				},
				endpoint: 1
			});
		}

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, data => {
			this._debug('genAnalogInput - presentValue (power)', data);
			this.setCapabilityValue('measure_power', data);
		}, 1);

		// meter_power
		// applicationType : 720896 = 0x0B0000 Energy in kWH
		// Register meter_power capability
		if (this.hasCapability('meter_power')) {
			this.registerCapability('meter_power', 'genAnalogInput', {
				get: 'presentValue',
				getOpts: {
					// getOnStart: true, // get the initial value on app start (only use for non-battery devices)
					pollInterval: 600000, // maps to device settings
					// getOnOnline: true, // use only for battery devices
				},
				report: 'presentValue',
				reportParser: value => {
					this.log('genAnalogInput - presentValue (meter)', value);
					return value;
				},
				endpoint: 2
			});
		}

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, data => {
			this.log('genAnalogInput - presentValue (meter)', data);
			this.setCapabilityValue('meter_power', data);
		}, 2);

		// measure_voltage
		if (this.hasCapability('measure_voltage')) {
			this.registerCapability('measure_voltage', 'genPowerCfg', {
				get: 'mainsVoltage',
				getOpts: {
					// getOnStart: true, // get the initial value on app start (only use for non-battery devices)
					pollInterval: 600000, // maps to device settings
					// getOnOnline: true, // use only for battery devices
				},
				report: 'mainsVoltage',
				reportParser: value => {
					this.log('genAnalogInput - mainsVoltage', value / 10);
					return value / 10;
				},
				endpoint: 0,
			});
		}

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this._debug('registered attr report listener - genBasic - Lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

	}

	onLifelineReport(value) {
		this._debug('parsedData', new Buffer(value, 'ascii'));

		const parsedData = this.parseData(new Buffer(value, 'ascii'));
		this._debug('parsedData', parsedData);

		// switch onoff reportParser (ID 100)
		if (parsedData.hasOwnProperty('100')) {
			const parsedOnOff = parsedData['100'] === 1;
			this.log('lifeline - onoff state', parsedOnOff);
			this.setCapabilityValue('onoff', parsedOnOff);
		}
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
