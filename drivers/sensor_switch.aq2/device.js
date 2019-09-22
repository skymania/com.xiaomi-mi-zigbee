//lifeline validated
'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

let lastKey = null;

class AqaraWirelessSwitchAq2 extends ZigBeeDevice {
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
			3: {
				scene: 'Key Pressed 3 times'
			},
			4: {
				scene: 'Key Pressed 4 times'
			},
		};

		this.registerAttrReportListener('genOnOff', 0x8000, 1, 3600, 1,
				this.onOnOffListener.bind(this), 0)
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genOnOff - 0x8000', err);
			});

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
				this.onOnOffListener.bind(this), 0)
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genOnOff - onOff', err);
			});

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
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

	onOnOffListener(repScene) {
		this.log('genOnOff - onOff', repScene, this.sceneMap[repScene].scene, 'lastKey', lastKey);

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
}
module.exports = AqaraWirelessSwitchAq2;

// WXKG11LM_sensor_switch.aq2
/*
Node overview:
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ------------------------------------------
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] Node: 31956e48-9b41-47f5-a9b3-66ca8e09c15c
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] - Battery: false
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] - Endpoints: 0
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] -- Clusters:
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- zapp
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genBasic
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- 65281 : !�
                                                                                  (!�!"$
!
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genBasic
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- modelId : lumi.sensor_switch.aq2
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genGroups
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genGroups
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- genOnOff
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : genOnOff
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2018-03-03 16:10:55 [log] [ManagerDrivers] [sensor_switch.aq2] [0] --- manuSpecificCluster
2018-03-03 16:10:56 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- cid : manuSpecificCluster
2018-03-03 16:10:56 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ---- sid : attrs
2018-03-03 16:10:56 [log] [ManagerDrivers] [sensor_switch.aq2] [0] ------------------------------------------

65281 - 0xFF01 report:
{ '1': 3069,	=	Battery
'3': 23, 			= soc_temperature
'4': 5117,
'5': 34,
'6': 0,
'10': 0 }
*/
