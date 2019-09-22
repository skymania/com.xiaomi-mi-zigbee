'use strict';

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraLightSwitchSingle extends ZigBeeDevice {

	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		this.sceneMap = {
			0: {
				scene: 'Key Pressed 1 time'
			},
		};

		this._attrReportListeners['0_genOnOff'] = this._attrReportListeners['0_genOnOff'] || {};
		this._attrReportListeners['0_genOnOff']['onOff'] = this.onOnOffListener.bind(this);

		this._attrReportListeners['0_genBasic'] = this._attrReportListeners['0_genBasic'] || {};
		this._attrReportListeners['0_genBasic']['65281'] = this.onLifelineReport.bind(this);

		// define and register FlowCardTriggers
		this.onSceneAutocomplete = this.onSceneAutocomplete.bind(this);

		this.triggerButton1_button = new Homey.FlowCardTriggerDevice('button1_button');
		this.triggerButton1_button
			.register();

	}

	onOnOffListener(repScene) {
		this.log('genOnOff - onOff', repScene);

		if (Object.keys(this.sceneMap).includes(repScene.toString())) {
			const remoteValue = {
				scene: this.sceneMap[repScene].scene,
			};
			// Trigger the trigger card with 1 dropdown option
			Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
			// Trigger the trigger card with tokens
			this.triggerButton1_button.trigger(this, remoteValue, null);
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
		this.log('lifeline - battery', parsedBatPct);
		if (this.hasCapability('measure_battery') && this.hasCapability('alarm_battery')) {
			// Set Battery capability
			this.setCapabilityValue('measure_battery', parsedBatPct);
			// Set Battery alarm if battery percentatge is below 20%
			this.setCapabilityValue('alarm_battery', parsedBatPct < (this.getSetting('battery_threshold') || 20));
		}
	}
}

module.exports = AqaraLightSwitchSingle;
