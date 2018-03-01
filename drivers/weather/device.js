'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWeatherSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		const minIntTemp = this.getSetting('minIntTemp') || 60;
		const maxIntTemp = this.getSetting('maxIntTemp') || 3600;
		const repChangeTemp = this.getSetting('repChangeTemp') || 20; // note: 1 = 0.01 [°C]

		// Register the AttributeReportListener
		this.registerAttrReportListener('msTemperatureMeasurement', 'measuredValue', minIntTemp, maxIntTemp, repChangeTemp,
				this.onTemperatureReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - msTemperatureMeasurement');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - msTemperatureMeasurement', err);
			});


		const minIntHum = this.getSetting('minIntHum') || 60;
		const maxIntHum = this.getSetting('maxIntHum') || 3600;
		const repChangeHum = this.getSetting('repChangeHum') || 50; // note: 1 = 0.01 [%]

		// Register the AttributeReportListener
		this.registerAttrReportListener('msRelativeHumidity', 'measuredValue', minIntHum, maxIntHum, repChangeHum,
				this.onHumidityReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - msRelativeHumidity');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - msRelativeHumidity', err);
			});

		const minIntPres = this.getSetting('minIntPres') || 60;
		const maxIntPres = this.getSetting('maxIntPres') || 3600;
		const repChangePres = this.getSetting('repChangePres') || 100; // note: 1 = 0.01 [%]

		// Register the AttributeReportListener
		this.registerAttrReportListener('msPressureMeasurement', '16', minIntPres, maxIntPres, repChangePres,
				this.onPressureReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - msPressureMeasurement');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - msPressureMeasurement', err);
			});

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - lifeline', err);
			});
	}

	onTemperatureReport(value) {
		const parsedValue = Math.round((value / 100) * 10) / 10;
		this.log('measure_temperature', parsedValue);
		this.setCapabilityValue('measure_temperature', parsedValue);
	}

	onHumidityReport(value) {
		const parsedValue = Math.round((value / 100) * 10) / 10;
		this.log('measure_humidity', parsedValue);
		this.setCapabilityValue('measure_humidity', parsedValue);
	}

	onPressureReport(value) {
		const parsedValue = Math.round((value / 100) * 10);
		this.log('measure_pressure', parsedValue);
		this.setCapabilityValue('measure_pressure', parsedValue);
	}

	onLifelineReport(value) {
		/*
		const bytes = new Buffer(value, 'ascii')
		this.log('raw', value + " -- " + bytes.toString('hex'));
		this.log('vals', bytes, bytes[29], bytes[30], (bytes[31] + (bytes[32] << 8)));
		// battery reports
		var batRaw = (bytes[2] + (bytes[3] << 8));
		const rawVolts = batRaw / 100.0;

		var minVolts = 2.5;
		var maxVolts = 3.0;

		let pct = (rawVolts - minVolts) / (maxVolts - minVolts)
		let roundedPct = Math.min(100, Math.round(pct * 100));
		this.log('lifeline - battery', batRaw, rawVolts, roundedPct);

		// temperature reports
		var tempRaw = (bytes[21] + (bytes[22] << 8));
		if ((tempRaw & 0x8000) != 0) tempRaw -= 0x10000;
		const temp = tempRaw / 100.0;
		this.log('lifeline - temperature', temp);

		// humidity reports
		const hum = (bytes[25] + (bytes[26] << 8)) / 100.0;
		this.log('lifeline - humidity', hum);

		// pressure reports
		var presRaw = (bytes[29] + (bytes[30] << 8) + (bytes[31] << 8) + (bytes[32] << 8));
		this.log('lifeline - pressure', presRaw);

		this.log('=== parsedData:', );

    */
		const parsedData = parseData(new Buffer(value, 'ascii'));

		// battery reportParser
		const parsedVolts = parsedData['1'] / 100.0;
		var minVolts = 2.5;
		var maxVolts = 3.0;

		let parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
		this.log('lifeline - battery', parsedBatPct);
		// this.setCapabilityValue('measure_battery', parsedBatPct);

		// temperature reportParser
		const parsedTemp = parsedData['100'] / 100.0;
		this.log('lifeline - temperature', parsedTemp);
		this.setCapabilityValue('measure_temperature', parsedTemp);

		// humidity reportParser
		const parsedHum = parsedData['101'] / 100.0;
		this.log('lifeline - humidity', parsedHum);
		this.setCapabilityValue('measure_humidity', parsedHum);

		// pressure reportParser
		const parsedPres = parsedData['102'] / 100.0;
		this.log('lifeline - pressure', parsedPres);

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
	}
}

module.exports = AqaraWeatherSensor;

// WSDCGQ11LM_weather

/*
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ZigBeeDevice has been inited
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ------------------------------------------
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] Node: 00881eb0-f819-44c5-ade7-87b56d3f7a14
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] - Battery: false
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] - Endpoints: 0
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] -- Clusters:
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- zapp
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- genBasic
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- 65281 : !�
f+R�                                                                    !�C!5$d)�e!
!
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- cid : genBasic
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- modelId : lumi.weather
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- genIdentify
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- cid : genIdentify
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- genGroups
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- cid : genGroups
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- msTemperatureMeasurement
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- cid : msTemperatureMeasurement
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- measuredValue : 1856
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] --- msPressureMeasurement
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- 16 : 10148
2018-02-28 22:13:08 [log] [ManagerDrivers] [weather] [0] ---- 20 : -1
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- cid : msPressureMeasurement
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- measuredValue : 1014
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] --- msRelativeHumidity
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- cid : msRelativeHumidity
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- measuredValue : 3153
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] --- manuSpecificCluster
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- cid : manuSpecificCluster
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ---- sid : attrs
2018-02-28 22:13:09 [log] [ManagerDrivers] [weather] [0] ------------------------------------------
*/
