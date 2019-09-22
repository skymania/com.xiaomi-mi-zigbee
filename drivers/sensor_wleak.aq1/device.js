'use strict';

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWaterSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

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

	}

	onLifelineReport(value) {
		this._debug('lifeline report', new Buffer(value, 'ascii'));
		/*
		const parsedData = parseData(new Buffer(value, 'ascii'));
		this._debug('parsedData', parsedData);

		// battery reportParser (ID 1)
		if (parsedData.hasOwnProperty('1')) {
			const parsedVolts = parsedData['1'] / 1000;
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
		}

		// contact alarm reportParser (ID 100)
		if (parsedData.hasOwnProperty('100')) {
			const parsedContact = (parsedData['100'] === 1);
			this.log('lifeline - contact alarm', parsedContact);
			this.setCapabilityValue('alarm_contact', parsedContact);
		}

		function parseData(rawData) {
			const data = {};
			let index = 0;
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				// extract the relevant objects (1) Battery, (100) Temperature, (101) Humidity
				if ([1, 100].includes(rawData.readUInt8(index))) {
					data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				}
				index += byteLength + 2;
			}
			return data;
		}
		*/
	}

}

module.exports = AqaraWaterSensor;

/*
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ------------------------------------------
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] Node: ccdc2a0a-a438-42d3-a3d7-4de0de5e21e4
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] - Battery: false
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] - Endpoints: 0
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] -- Clusters:
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] --- zapp
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] --- genBasic
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- cid : genBasic
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- sid : attrs
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] --- genPowerCfg
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- cid : genPowerCfg
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- sid : attrs
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] --- genIdentify
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- cid : genIdentify
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- sid : attrs
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] --- genOta
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- cid : genOta
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ---- sid : attrs
2017-10-29 19:03:00 [log] [ManagerDrivers] [sensor_wleak.aq1] [0] ------------------------------------------
*/
