'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

let lastKey = null;

class AqaraWirelessSwitchAq3 extends ZigBeeDevice {
	async onMeshInit() {

		// supported scenes and their reported attribute numbers
		this.sceneArray = {
			1: {
				scene: 'Key Pressed 1 time'
			},
			2: {
				scene: 'Key Pressed 2 times'
			},
			16: {
				scene: 'Key Held Down'
			},
			17: {
				scene: 'Key Released'
			},
			18: {
				scene: 'Shaken'
			},
		};

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genOnOff - 0x8000');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genOnOff - 0x8000', err);
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

		// define and register FlowCardTriggers
		this._onSceneAutocomplete = this._onSceneAutocomplete.bind(this);

		this.triggerButton1_scene = new Homey.FlowCardTriggerDevice('trigger_button1_scene');
		this.triggerButton1_scene
			.register()
			.registerRunListener((args, state) => {
				return Promise.resolve(args.scene.id === state.scene);
			})
			.getArgument('scene')
			.registerAutocompleteListener(this._onSceneAutocomplete);

		this.triggerButton1_button = new Homey.FlowCardTriggerDevice('button1_button');
		this.triggerButton1_button
			.register();

	}

	onSceneListener(data) {

		this.log('genOnOff - onOff', data, 'lastKey', lastKey);

		this.log('debug', this.sceneArray[data].scene, this.sceneArray.includes(data.parseInt()));
		if (lastKey !== data) {
			lastKey = data;

			const remoteValue = {
				scene: this.sceneArray[data].scene,
			};
			this.log('Scene trigger', remoteValue.scene);
			// Trigger the trigger card with 1 dropdown option
			this.triggerButton1_scene.trigger(this, this.triggerButton1_scene.getArgumentValues, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton1_button.trigger(this, remoteValue, null);
			// reset lastKey after the last trigger
			this.buttonLastKeyTimeout = setTimeout(() => {
				lastKey = null;
			}, 3000);
		}
	}

	_onSceneAutocomplete(query) {
		this.log(this.getName());
		let resultArray = [];
		this.log(this.sceneArray);
		for (let sceneID in this.sceneArray) {
			this.log(this.sceneArray[sceneID], this.sceneArray[sceneID].scene);

			resultArray.push({
				id: this.sceneArray[sceneID].scene,
				name: Homey.__(this.sceneArray[sceneID].scene),
			})
		}
		this.log('resultArray', resultArray);
		return resultArray;
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

		// contact alarm reportParser (ID 100)
		// const parsedContact = (parsedData['100'] === 1);
		// this.log('lifeline - contact alarm', parsedContact);
		// this.setCapabilityValue('alarm_contact', parsedContact);

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
module.exports = AqaraWirelessSwitchAq3;

/*
'values': [
	{
		'id': 'Key Pressed 1 time',
		'label': {
			'en': 'Pressed 1x',
			'nl': '1x ingedrukt'
		}
	},
	{
		'id': 'Key Pressed 2 times',
		'label': {
			'en': 'Pressed 2x',
			'nl': '2x ingedrukt'
		}
	},
	{
		'id': 'Key Pressed 3 times',
		'label': {
			'en': 'Pressed 3x',
			'nl': '3x ingedrukt'
		}
	},
	{
		'id': 'Key Pressed 4 times',
		'label': {
			'en': 'Pressed 4x',
			'nl': '4x ingedrukt'
		}
	}
]
*/


// WXKG12LM_sensor_switch.aq3
/*
Node overview:
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ZigBeeDevice has been inited
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ------------------------------------------
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] Node: 609c6602-98b4-42ae-8aba-a50a22a01977
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] - Battery: false
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] - Endpoints: 0
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] -- Clusters:
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] --- zapp
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] --- genBasic
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- cid : genBasic
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- sid : attrs
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- manufacturerName : LUMI
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- modelId : lumi.sensor_swit
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] --- genPowerCfg
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- cid : genPowerCfg
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- sid : attrs
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] --- genOnOff
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- cid : genOnOff
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- sid : attrs
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] --- genMultistateInput
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- cid : genMultistateInput
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ---- sid : attrs
2018-03-27 23:54:02 [log] [ManagerDrivers] [sensor_switch.aq3] [0] ------------------------------------------
*/
