'use strict';

// Add FlowCardTriggers (motion trigger, tilt trigger, alarm (re)set)
// Add icons
// clean up code onTiltReportRAW

const motionArray = {
	1: {
		motion: 'vibration'
	},
	2: {
		motion: 'tilt'
	},
	3: {
		motion: 'drop'
	},
};

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraVibrationSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '85', 1, 60, null,
				this.onMotionReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - closuresDoorLock_85');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - closuresDoorLock_85', err);
			});

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '1283', 1, 60, null,
				this.onMotionReport_1283.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - closuresDoorLock_1283');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - closuresDoorLock_1283', err);
			});

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '1285', 1, 60, null,
				this.onMotionReport_1285.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - closuresDoorLock_1285');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - closuresDoorLock_1285', err);
			});

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '1288', 1, 60, null,
				this.onTiltReportRAW.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - closuresDoorLock_1288');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - closuresDoorLock_1288', err);
			});

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

		// sensor motion trigger
		this.sensorMotionTriggerDevice = new Homey.FlowCardTriggerDevice('sensor_motion');
		this.sensorMotionTriggerDevice.register();

		// Vibration alarm triggers
		this.alarm_vibrationTrueTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_vibration_true');
		this.alarm_vibrationTrueTriggerDevice.register();

		this.alarm_vibrationFalseTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_vibration_false');
		this.alarm_vibrationFalseTriggerDevice.register();

		// Tilt alarm triggers
		this.alarm_tiltTrueTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_tilt_true');
		this.alarm_tiltTrueTriggerDevice.register();

		this.alarm_tiltFalseTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_tilt_false');
		this.alarm_tiltFalseTriggerDevice.register();

		// Drop alarm triggers
		this.alarm_dropTrueTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_drop_true');
		this.alarm_dropTrueTriggerDevice.register();

		this.alarm_dropFalseTriggerDevice = new Homey.FlowCardTriggerDevice('alarm_drop_false');
		this.alarm_dropFalseTriggerDevice.register();

		this.tiltDeltaTriggerDevice = new Homey.FlowCardTriggerDevice('tilt_delta');
		this.tiltDeltaTriggerDevice.register();

		this.tiltReferenceTriggerDevice = new Homey.FlowCardTriggerDevice('tilt_reference');
		this.tiltReferenceTriggerDevice.register();

	}

	onMotionReport(value) {
		const motionType = motionArray[value].motion;
		this.log('motion detected', motionType, value);

		// Trigger generic motion token trigger card
		this.sensorMotionTriggerDevice.trigger(this, {
				motion: motionType
			})
			.then(() => this.log('Triggered sensorMotionTriggerDevice with token', motionType))
			.catch(err => this.error('Error triggering sensorMotionTriggerDevice', err));

		//
		if (this.getCapabilityValue(`alarm_${motionType}`) !== true) {
			// >>> this.log('triggering alarm', motionType);
			this.setCapabilityValue(`alarm_${motionType}`, true);
			// Trigger alarm trigger card (trigger alarm)
			this[`alarm_${motionType}TrueTriggerDevice`].trigger(this, null, null)
				.then(() => this.log(`Triggered alarm_${motionType}TrueTriggerDevice`))
				.catch(err => this.error(`Error triggering alarm_${motionType}TrueTriggerDevice`, err));
		}
		// restart alarm cancellation timer
		clearTimeout(this[`alarm${motionType}Timeout`]);

		// start alarm cancellation timer
		this[`alarm${motionType}Timeout`] = setTimeout(() => {
			// >>> this.log('resetting alarm', motionType);
			this.setCapabilityValue(`alarm_${motionType}`, false);
			// Trigger alarm trigger card (reset alarm)
			this[`alarm_${motionType}FalseTriggerDevice`].trigger(this, null, null)
				.then(() => this.log(`Triggered alarm_${motionType}FalseTriggerDevice`))
				.catch(err => this.error(`Error triggering alarm_${motionType}FalseTriggerDevice`, err));
		}, (this.getSetting(`alarm_${motionType}_cancellation_delay`) || 30) * 1000);
	}

	onMotionReport_1283(value) {
		this.log('tilt angle:', value);
	}

	onMotionReport_1285(value) {
		this.log('onMotionReport_1285', value);
	}

	onTiltReportRAW(value) {
		const RAD = Math.PI / 180;

		// FIX data as parsed by the Zigbee Shepherd
		const toInt16 = v => Int16Array.from([v])[0];

		const Rx = toInt16((value[1]) & 0xffff);
		const Ry = toInt16((value[1] >> 16) & 0xffff);
		const Rz = toInt16(value[0]);

		// calculate force vector
		const R = Math.sqrt(Rx * Rx + Ry * Ry + Rz * Rz);

		// Three different reference planes:
		// 1. Calculate angles normalized force vector relative to axis
		const Axr = Math.acos(Rx / R) / RAD;
		const Ayr = Math.acos(Ry / R) / RAD;
		const Azr = Math.acos(Rz / R) / RAD;
		const Ameasured = [Axr, Ayr, Azr];
		this.log('onMotionReportRAW:', value, 'Measured angles', Ameasured);

		// 2. Calculate angles normalized force vector relative to reference plane
		const Areference = this.getStoreValue('Areference') || [90, 90, 0];

		var Arelative = Areference.map(function (item, index) {
			// item correspond to currentValue of array Areference using index to get value from array Ameasured
			return item - Ameasured[index];
		});

		var Arelative_max = Math.abs(Arelative[0]) > Math.abs(Arelative[1]) ? Arelative[0] : Arelative[1];

		const tiltRelativeToken = {
			Tilt_x: Math.round(Arelative[0] * 100) / 100,
			Tilt_y: Math.round(Arelative[1] * 100) / 100,
			Tilt_max: Math.round(Arelative_max * 100) / 100,
			Tilt_abs: Math.round(Math.abs(Arelative_max) * 100) / 100,
		};

		this.log('Tilt angles relative to reference plane:', tiltRelativeToken.Tilt_x, '(Tilt_x)', tiltRelativeToken.Tilt_y, '(Tilt_y)', tiltRelativeToken.Tilt_max, '(max(Tilt))', tiltRelativeToken.Tilt_abs, '(abs(Tilt))');

		this.setCapabilityValue('measure_tilt', this.getSetting('capabilityTiltAngles') === 'signed' ? tiltRelativeToken.Tilt_max : tiltRelativeToken.Tilt_abs);

		// Trigger generic motion token trigger card
		this.tiltReferenceTriggerDevice.trigger(this, tiltRelativeToken)
			// .then(() => this.log('Triggered tiltRelativeTriggerDevice with token'))
			.catch(err => this.error('Error triggering tiltRelativeTriggerDevice', err));

		// 3. Calculate angles normalized force vector relative to previous plane
		const Ameasured_previous = this.getStoreValue('Ameasured_previous') || [90, 90, 0];

		var Adelta = Ameasured_previous.map(function (item, index) {
			// item correspond to currentValue of array Ameasured_previous using index to get value from array Ameasured
			return item - Ameasured[index];
		});

		var Adelta_max = Math.abs(Adelta[0]) > Math.abs(Adelta[1]) ? Adelta[0] : Adelta[1];
		const tiltDeltaToken = {
			Tilt_x: Math.round(Adelta[0] * 100) / 100,
			Tilt_y: Math.round(Adelta[1] * 100) / 100,
			Tilt_max: Math.round(Adelta_max * 100) / 100,
			Tilt_abs: Math.round(Math.abs(Adelta_max) * 100) / 100,
		};

		this.log('Tilt angles relative to previous position:', tiltDeltaToken.Tilt_x, '(Tilt_x)', tiltDeltaToken.Tilt_y, '(Tilt_y)', tiltDeltaToken.Tilt_max, '(max(Tilt))', tiltDeltaToken.Tilt_abs, '(abs(Tilt))');

		this.setCapabilityValue('measure_tilt.delta', this.getSetting('capabilityTiltAngles') === 'signed' ? tiltDeltaToken.Tilt_max : tiltDeltaToken.Tilt_abs);

		// Trigger generic motion token trigger card
		this.tiltDeltaTriggerDevice.trigger(this, tiltDeltaToken)
			// .then(() => this.log('Triggered tiltDeltaTriggerDevice with token'))
			.catch(err => this.error('Error triggering tiltDeltaTriggerDevice', err));

		// update previous normalized force vector
		this.setStoreValue('Ameasured_previous', Ameasured);

		// update reference normalized force vector if requested
		if (this.getSetting('setReferenceVector') === true) {
			this.setStoreValue('Areference', Ameasured);

			var Ameasured_rounded = Ameasured.map(function (each_element) {
				return Number(each_element.toFixed(0));
			});

			this.setSettings({
				tiltReferenceVector: Ameasured_rounded.toString(),
				setReferenceVector: false,
			});

			// this.setSettings({
			//	setReferenceVector: false,
			// });
		}
	}

	onLifelineReport(value) {
		this.log('lifeline report', new Buffer(value, 'ascii'));
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

		// temperature reportParser (ID 100)
		const parsedTemp = parsedData['100'] / 100.0;
		const temperatureOffset = this.getSetting('temperature_offset') || 0;
		this.log('lifeline - temperature', parsedTemp, '+ temperature offset', temperatureOffset);
		this.setCapabilityValue('measure_temperature', parsedTemp + temperatureOffset);

		// humidity reportParser (ID 101)
		const parsedHum = parsedData['101'] / 100.0;
		this.log('lifeline - humidity', parsedHum);
		this.setCapabilityValue('measure_humidity', parsedHum);

		// pressure reportParser (ID 102) - reported number not reliable
		// const parsedPres = parsedData['102'] / 100.0;
		// this.log('lifeline - pressure', parsedPres);

		function parseData(rawData) {
			const data = {};
			let index = 0;
			// let byteLength = 0
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				// extract the relevant objects (1) Battery, (100) Temperature, (101) Humidity
				if ([1, 100, 101].includes(rawData.readUInt8(index))) {
					data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				}
				index += byteLength + 2;
			}
			return data;
		}
		*/
	}

}

module.exports = AqaraVibrationSensor;

// DJT11LM

/*

Cluster Door Lock (0x0101) endpoint 0
Attributes
PresentValue (0x0055) (Uint16)	-> 1 = vibration, 2 = tilt, 3 = drop
1283:	0x0503 (Uint16) ->   = tilt angle
1285: 0x0505 (Uint32)
1288: 0x0508 (Uint48) ->   = force vector

settings

Write attribute: 0xff0d,
High sensitivity: Uint8 = 1, Medium: Uint8 = 11, Low: Uint8 = 21

Node overview:
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ZigBeeDevice has been inited
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ------------------------------------------
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] Node: 1e296da1-c267-4ecd-9228-c225d8e8ab14
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] - Battery: false
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] - Endpoints: 0
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] -- Clusters:
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] --- zapp
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] --- genBasic
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- 65281 : !�
                                                                              (!�!!
!�!(�!r�%���
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genBasic
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- modelId : lumi.vibration.aq1
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] --- genIdentify
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genIdentify
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] --- genGroups
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genGroups
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] --- genScenes
2018-09-01 09:15:14 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genScenes
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- genOta
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genOta
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- closuresDoorLock
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- 85 : 2
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- 1283 : 24
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- 1285 : 11730944
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- 1288 : [ 1195 ]
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : closuresDoorLock
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] - Endpoints: 1
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] -- Clusters:
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- zapp
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- genIdentify
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genIdentify
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- genGroups
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genGroups
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- genScenes
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genScenes
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] --- genMultistateInput
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- cid : genMultistateInput
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ---- sid : attrs
2018-09-01 09:15:15 [log] [ManagerDrivers] [vibration.aq1] [0] ------------------------------------------

65281 - 0xFF01 report:
{ '1': 3069,		= Battery voltage
  '4': 5117,
  '5': 61,
  '6': 1,
  '10': 0,
  '100': 2094,	= temperature
  '101': 3676,	= humidity
  '102': 130557 = pressure - reported number not reliable
}

Tilting the sensor ~ 28 degrees
2018-09-01 09:28:45 [log] [ManagerDrivers] [vibration.aq1] [0] motion detected tilt 2
2018-09-01 09:28:45 [log] [ManagerDrivers] [vibration.aq1] [0] tilt angle: 28
2018-09-01 09:28:45 [log] [ManagerDrivers] [vibration.aq1] [0] onMotionReport_1288 [ 1043, 36044791 ]
2018-09-01 09:28:52 [log] [ManagerDrivers] [vibration.aq1] [0] motion detected tilt 2
2018-09-01 09:28:52 [log] [ManagerDrivers] [vibration.aq1] [0] tilt angle: 28
2018-09-01 09:28:52 [log] [ManagerDrivers] [vibration.aq1] [0] onMotionReport_1288 [ 1194, 4294901777 ]

Tilting the sensor on one side ~ 90 degrees
2018-09-01 09:29:42 [log] [ManagerDrivers] [vibration.aq1] [0] motion detected vibration 1
2018-09-01 09:29:43 [log] [ManagerDrivers] [vibration.aq1] [0] motion detected tilt 2
2018-09-01 09:29:43 [log] [ManagerDrivers] [vibration.aq1] [0] tilt angle: 82
2018-09-01 09:29:43 [log] [ManagerDrivers] [vibration.aq1] [0] onMotionReport_1288 [ 151, 67960815 ]
2018-09-01 09:29:55 [log] [ManagerDrivers] [vibration.aq1] [0] motion detected tilt 2
2018-09-01 09:29:55 [log] [ManagerDrivers] [vibration.aq1] [0] tilt angle: 82
2018-09-01 09:29:56 [log] [ManagerDrivers] [vibration.aq1] [0] onMotionReport_1288 [ 1193, 4294770707 ]




*/