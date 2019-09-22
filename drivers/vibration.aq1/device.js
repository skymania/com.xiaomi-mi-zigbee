//lifeline validated
'use strict';

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

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraVibrationSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		// Register attribute listener for motion report
		this.registerAttrReportListener('closuresDoorLock', '85', 1, 60, null,
				this.onMotionReport.bind(this), 0)
			.catch(err => {
				this.error('failed to register attr report listener - Motion report (85)', err);
			});

		// Register attribute listener for direct Tilt report
		this.registerAttrReportListener('closuresDoorLock', '1283', 1, 60, null,
				this.onTiltReport.bind(this), 0)
			.catch(err => {
				this.error('failed to register attr report listener - Tilt report (1283)', err);
			});

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '1285', 1, 60, null,
				this.onVibrationReport.bind(this), 0)
			.catch(err => {
				this.error('failed to register attr report listener - Vibration report (1285)', err);
			});

		// Register attribute listener for occupancy
		this.registerAttrReportListener('closuresDoorLock', '1288', 1, 60, null,
				this.onTiltReportRAW.bind(this), 0)
			.catch(err => {
				this.error('failed to register attr report listener - RAW Tilt report (1288)', err);
			});

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.catch(err => {
				this.error('failed to register attr report listener - Lifeline report (65281)', err);
			});

		// sensor motion trigger
		this.sensorMotionTriggerDevice = new Homey.FlowCardTriggerDevice('sensor_motion');
		this.sensorMotionTriggerDevice.register();

		// sensor vibration trigger
		this.sensorVibrationTriggerDevice = new Homey.FlowCardTriggerDevice('sensor_vibration');
		this.sensorVibrationTriggerDevice.register();

		// sensor vibration triggers
		this.tiltDeltaTriggerDevice = new Homey.FlowCardTriggerDevice('sensor_tilt_delta');
		this.tiltDeltaTriggerDevice.register();

		this.tiltReferenceTriggerDevice = new Homey.FlowCardTriggerDevice('sensor_tilt_reference');
		this.tiltReferenceTriggerDevice.register();

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

	}

	onMotionReport(value) {
		const motionType = motionArray[value].motion;
		this.log('closuresDoorLock - 85 (motion)', motionType, value);

		// Trigger generic motion token trigger card
		this.sensorMotionTriggerDevice.trigger(this, {
				motion: motionType
			})
			// .then(() => this.log('Triggered sensorMotionTriggerDevice with token', motionType))
			.catch(err => this.error('Error triggering sensorMotionTriggerDevice', err));

		//
		if (this.getCapabilityValue(`alarm_${motionType}`) !== true) {
			this.setCapabilityValue(`alarm_${motionType}`, true);
		}
		// restart alarm cancellation timer
		clearTimeout(this[`alarm${motionType}Timeout`]);

		// start alarm cancellation timer
		this[`alarm${motionType}Timeout`] = setTimeout(() => {
			this.setCapabilityValue(`alarm_${motionType}`, false);
		}, (this.getSetting(`alarm_${motionType}_cancellation_delay`) || 30) * 1000);
	}

	onTiltReport(value) {
		this.log('closuresDoorLock - 1283 (tilt angle):', value);
	}

	onVibrationReport(value) {
		const toInt16 = v => Int16Array.from([v])[0];
		const parsedValue = toInt16(value >> 16 & 0xffff);
		this.log('closuresDoorLock - 1285 (vibration):', value, parsedValue);
		this.setCapabilityValue('measure_vibration', parsedValue);

		this.sensorVibrationTriggerDevice.trigger(this, {
				vibration: parsedValue
			})
			// .then(() => this.log('Triggered sensorVibrationTriggerDevice with token', parsedValue))
			.catch(err => this.error('Error triggering sensorVibrationTriggerDevice', err));
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
		this.log('closuresDoorLock - 1288 (Tilt RAW):', value, 'Measured angles', Ameasured);

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

		this.setCapabilityValue('measure_tilt.relative', this.getSetting('capabilityTiltAngles') === 'signed' ? tiltDeltaToken.Tilt_max : tiltDeltaToken.Tilt_abs);

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

		}
	}

	onLifelineReport(value) {
		this._debug('lifeline report', new Buffer(value, 'ascii'));

		const parsedData = this.parseData(new Buffer(value, 'ascii'));
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

	}

	/* Unable to write the sensor sensitivity value, when not defined
	JSON section:
	{
		"id": "vibrationSensitivity",
		"type": "dropdown",
		"label": {
			"en": "Adjust vibration sensitivity"
		},
		"hint": {
			"en": "Adjust the vibration sensor sensitivity.\nPress the device button before or directly after pressing save."
		},
		"value": "11",
		"values": [
			{
				"id": "1",
				"label": {
					"en": "High vibration sensitivity"
				}
			},
			{
				"id": "11",
				"label": {
					"en": "Medium vibration sensitivity"
				}
			},
			{
				"id": "21",
				"label": {
					"en": "Low vibration sensitivity"
				}
			}
		]
	},

	onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {
		this.log(changedKeysArr);
		this.log('newSettingsObj', newSettingsObj);
		this.log('oldSettingsObj', oldSettingsObj);
		this.log('test: ', changedKeysArr.includes('vibrationSensitivity'));
		// localTemperatureCalibration changed
		if (changedKeysArr.includes('vibrationSensitivity') && newSettingsObj.vibrationSensitivity) {
			this.log('vibrationSensitivity: ', newSettingsObj.vibrationSensitivity);
			this.log('genBasic', this.node.endpoints[0].clusters.genBasic);
			callback(null, true);
			this.node.endpoints[0].clusters.genBasic.write('65293')
				.then(result => {
					this.log('vibrationSensitivity: ', result);
				})
				.catch(err => {
					this.log('could not write vibrationSensitivity', err);
				});
		}
	}
	*/

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
High sensitivity: Uint8 = 1 (0x01), Medium: Uint8 = 11 (0x0b), Low: Uint8 = 21 (0x15)

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

{ '1': 3069,	=	battery
  '3': 32,
  '4': 5117,
  '5': 84,
  '6': 65538,
  '8': 776,
  '10': 0,
  '253': 4823264854269 }

*/
