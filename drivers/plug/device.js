'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
//const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AqaraPlug extends ZigBeeDevice
{

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

		this.registerCapability('onoff', 'genOnOff');

		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, data =>
		{
			if (this.getCapabilityValue('onoff') != (data == 1))
			{
				this.log('genOnOff - onOff', data);
				this.setCapabilityValue('onoff', data == 1);
			}
		}, 0);

		this.registerReportListener('genOnOff', 'onOff', report => {
			this.log(report);
		}, 0);
	}

}

module.exports = AqaraPlug;
