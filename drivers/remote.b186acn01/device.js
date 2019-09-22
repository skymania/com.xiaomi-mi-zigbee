'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

let lastKey = null;

class AqaraRemoteb186acn01 extends ZigBeeDevice {
	async onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		// supported scenes and their reported attribute numbers (all based on reported data)
		this.sceneMap = {
			1: {
				scene: 'Key Pressed 1 time'
			},
			2: {
				scene: 'Key Pressed 2 times'
			},
			0: {
				scene: 'Key long pressed'
			},
		};

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this._debug('registered attr report listener - genMultistateInput - presentValue');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - presentValue', err);
			});

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

		// define and register FlowCardTriggers
		this.onSceneAutocomplete = this.onSceneAutocomplete.bind(this);

		this.triggerButton1_button = new Homey.FlowCardTriggerDevice('button1_button');
		this.triggerButton1_button
			.register();

	}

	onSceneListener(repScene) {
		this.log('genMultistateInput - presentValue', this.sceneMap[repScene].scene, 'lastKey', lastKey);

		if (lastKey !== repScene) {
			lastKey = repScene;
			if (Object.keys(this.sceneMap).includes(repScene.toString())) {
				const remoteValue = {
					scene: this.sceneMap[repScene].scene,
				};
				this._debug('Scene trigger', remoteValue.scene);
				// Trigger the trigger card with 1 dropdown option
				Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
				// Trigger the trigger card with tokens
				this.triggerButton1_button.trigger(this, remoteValue, null);
				// reset lastKey after the last trigger
				this.buttonLastKeyTimeout = setTimeout(() => {
					lastKey = null;
				}, 3000);
			}
		}
	}

	onSceneAutocomplete(query, args, callback) {

		let resultArray = [];
		for (let sceneID in this.sceneMap) {
			resultArray.push({
				id: this.sceneMap[sceneID].scene,
				name: Homey.__(this.sceneMap[sceneID].scene),
			})
		}
		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this._debug(resultArray);
		return Promise.resolve(resultArray);
	}

	onLifelineReport(value) {
		this._debug('lifeline report', new Buffer(value, 'ascii'));
		
		const parsedData = this.parseData(new Buffer(value, 'ascii'));
		// this._debug('parsedData', parsedData);

		// battery reportParser (ID 1)
		const parsedVolts = parsedData['1'] / 100.0;
		const minVolts = 2.5;
		const maxVolts = 3.0;

		const parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
		this._debug('lifeline - battery', parsedBatPct);
		if (this.hasCapability('measure_battery') && this.hasCapability('alarm_battery')) {
			// Set Battery capability
			this.setCapabilityValue('measure_battery', parsedBatPct);
			// Set Battery alarm if battery percentatge is below 20%
			this.setCapabilityValue('alarm_battery', parsedBatPct < (this.getSetting('battery_threshold') || 20));
		}

		// contact alarm reportParser (ID 100)
		// const parsedContact = (parsedData['100'] === 1);
		// this._debug('lifeline - contact alarm', parsedContact);
		// this.setCapabilityValue('alarm_contact', parsedContact);

	}
}
module.exports = AqaraRemoteb186acn01;

// WXKG11LM_ remote.b1acn01
/*
Node overview:
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ZigBeeDevice has been inited
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ------------------------------------------
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] Node: 23afeffe-6404-4f34-9cb8-a001fc4149d6
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] - Battery: false
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] - Endpoints: 0
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] -- Clusters:
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- zapp
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genBasic
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- 65520 : �A�

2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genBasic
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genMultistateInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genMultistateInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- presentValue : 2
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genOta
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genOta
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- manuSpecificCluster
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : manuSpecificCluster
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] - Endpoints: 1
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] -- Clusters:
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- zapp
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genMultistateInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genMultistateInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] - Endpoints: 2
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] -- Clusters:
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- zapp
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genIdentify
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genGroups
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genScenes
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] --- genAnalogInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- cid : genAnalogInput
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ---- sid : attrs
2018-10-13 21:59:09 [log] [ManagerDrivers] [remote.b186acn01] [0] ------------------------------------------

*/
