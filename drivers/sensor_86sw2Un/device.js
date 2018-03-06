'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraLightSwitchDouble extends ZigBeeDevice {

	onMeshInit() {

		// define and register FlowCardTriggers
		this.triggerButton2_scene = new Homey.FlowCardTriggerDevice('button2_scene');
		this.triggerButton2_scene
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.button === state.button && args.scene === state.scene);
			});

		this.triggerButton2_button = new Homey.FlowCardTriggerDevice('button2_button');
		this.triggerButton2_button
			.register();

		this._attrReportListeners['0_genOnOff'] = this._attrReportListeners['0_genOnOff'] || {};
		this._attrReportListeners['0_genOnOff']['onOff'] = this.onOnOffListener.bind(this);

		this._attrReportListeners['1_genOnOff'] = this._attrReportListeners['1_genOnOff'] || {};
		this._attrReportListeners['1_genOnOff']['onOff'] = this.onOnOffListener2.bind(this);

		this._attrReportListeners['2_genOnOff'] = this._attrReportListeners['2_genOnOff'] || {};
		this._attrReportListeners['2_genOnOff']['onOff'] = this.onOnOffListener3.bind(this);

		this._attrReportListeners['0_genBasic'] = this._attrReportListeners['0_genBasic'] || {};
		this._attrReportListeners['0_genBasic']['65281'] = this.onLifelineReport.bind(this);

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
	onOnOffListener(data) {
		this.log('genOnOff - onOff', data, 'Left button');
		if (data === 0) {
			const remoteValue = {
				button: 'Left button',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}
	onOnOffListener2(data) {
		this.log('genOnOff - onOff', data, 'Right button');
		if (data === 0) {
			const remoteValue = {
				button: 'Right button',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}
	onOnOffListener3(data) {
		this.log('genOnOff - onOff', data, 'Both buttons');
		if (data === 0) {
			const remoteValue = {
				button: 'Both buttons',
				scene: 'Key Pressed 1 time',
			};
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton2_scene.trigger(this, this.triggerButton2_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton2_button.trigger(this, remoteValue, null);
		}
	}

	onLifelineReport(value) {
		this.log('lifeline report', new Buffer(value, 'ascii'));
		/*
		const parsedData = parseData(new Buffer(value, 'ascii'));
		// this.log('parsedData', parsedData);

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

		function parseData(rawData) {
			const data = {};
			let index = 0;
			let byteLength = 0
			while (index <= rawData.length - 2 - byteLength) {
				const type = rawData.readUInt8(index + 1);
				byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				console.log('parsing', index, type, byteLength, isSigned, index + 2 + byteLength <= rawData.length);
				data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				index += byteLength + 2;
			}
			return data;
		}
		*/
	}
}

module.exports = AqaraLightSwitchDouble;

// WXKG02LM
/*
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ------------------------------------------
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] Node: 1185fec2-4b26-438d-aaa9-7a54ee4486a9
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Battery: false
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 0
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genBasic
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genBasic
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genOta
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genOta
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- manuSpecificCluster
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : manuSpecificCluster
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 1
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genMultistateInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] - Endpoints: 2
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] -- Clusters:
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- zapp
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genIdentify
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genGroups
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genScenes
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] --- genAnalogInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- cid : genAnalogInput
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ---- sid : attrs
2017-10-22 23:20:10 [log] [ManagerDrivers] [sensor_86sw2Un] [0] ------------------------------------------
*/
