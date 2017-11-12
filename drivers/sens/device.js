'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class XiaomiTempSensor extends ZigBeeDevice {
	onMeshInit() {

		// Register the AttributeReportListener for measure_temperature
		this._attrReportListeners['0_msTemperatureMeasurement'] = this._attrReportListeners['0_msTemperatureMeasurement'] || {};
		this._attrReportListeners['0_msTemperatureMeasurement']['measuredValue'] = this.onTemperatureReport.bind(this);

		// Register the AttributeReportListener for measure_humidity
		this._attrReportListeners['0_msRelativeHumidity'] = this._attrReportListeners['0_msRelativeHumidity'] || {};
		this._attrReportListeners['0_msRelativeHumidity']['measuredValue'] = this.onHumidityReport.bind(this);

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

}

module.exports = XiaomiTempSensor;

// WSDCGQ01LM_sens
/*
2017-10-21 00:48:57 [log] [ManagerDrivers] [sens] [0] ------------------------------------------
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] Node: 78db4c1a-5cde-4f65-b68c-42ba2832ca3e
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] - Battery: false
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] - Endpoints: 0
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- zapp
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genBasic
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genBasic
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- modelId : lumi.sensor_ht
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genMultistateInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genMultistateInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genOta
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genOta
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- manuSpecificCluster
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : manuSpecificCluster
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] - Endpoints: 1
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- zapp
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genMultistateInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genMultistateInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] - Endpoints: 2
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] -- Clusters:
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- zapp
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genIdentify
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genGroups
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genScenes
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] --- genAnalogInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- cid : genAnalogInput
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ---- sid : attrs
2017-10-21 00:48:58 [log] [ManagerDrivers] [sens] [0] ------------------------------------------
*/
