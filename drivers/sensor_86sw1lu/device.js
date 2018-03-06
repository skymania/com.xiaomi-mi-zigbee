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
		this.log('genOnOff - onOff', data);
		const remoteValue = {
			scene: 'Key Pressed 1 time',
		};
		// Trigger the trigger card with 1 dropdown option
		this.triggerButton1_scene.trigger(this, this.triggerButton1_scene.getArgumentValues, remoteValue);
		// Trigger the trigger card with tokens
		this.triggerButton1_button.trigger(this, remoteValue, null);
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

module.exports = AqaraLightSwitchSingle;
