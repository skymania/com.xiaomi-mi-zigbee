'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraLightControlDouble extends ZigBeeDevice {

	onMeshInit()
	{
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		this.registerAttrReportListener('genDeviceTempCfg', 'currentTemperature', 1, 60, 1, data =>
		{
			this.log('endpoint: 0 - currentTemperature', data);
			this.setCapabilityValue('measure_temperature', data);
		}, 0);

		this.registerReportListener('genDeviceTempCfg', 'currentTemperature', report =>
		{
			this.log(report);
		}, 0);

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', { endpoint: 1});
		this.registerCapability('onoff.1', 'genOnOff', { endpoint: 2});

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, data =>
		{
			this.log('endpoint: 1 - onOff', data === 1);
			this.setCapabilityValue('onoff', data === 1);
		}, 1);

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, data =>
		{
			this.log('endpoint: 2 - onOff', data === 1);
			this.setCapabilityValue('onoff.1', data === 1);
		}, 2);

		this.registerReportListener('genOnOff', 'onOff', report =>
		{
			this.log(report);
		}, 1);

		this.registerReportListener('genOnOff', 'onOff', report =>
		{
			this.log(report);
		}, 2);
	}

}

module.exports = AqaraLightControlDouble;
