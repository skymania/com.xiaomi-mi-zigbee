/*
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] Node: 2d1e9eac-fdb0-4251-b2b3-07c541beae9d
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] - Battery: false
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] - Endpoints: 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] -- Clusters:
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- zapp
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- genBasic
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genBasic
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- zclVersion : 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- appVersion : 8
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- stackVersion : 2
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- hwVersion : 33
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- manufacturerName : LUMI
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- modelId : lumi.sensor_natgas
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- dateCode : 10-19-2016
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- powerSource : 4
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- locationDesc :
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- genPowerCfg
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genPowerCfg
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- mainsVoltage : 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- mainsAlarmMask : 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- batteryVoltage : 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- genDeviceTempCfg
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genDeviceTempCfg
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- currentTemperature : 40
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- lowTempThres : 55
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- highTempThres : 60
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- genIdentify
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genIdentify
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] ---- identifyTime : 0
2017-10-29 23:57:59 [log] [ManagerDrivers] [sensor_natgas] [0] --- genGroups
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genGroups
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] --- genTime
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genTime
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] --- genOta
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : genOta
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] --- ssIasZone
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- cid : ssIasZone
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- sid : attrs
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- zoneState : 0
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- zoneType : 43
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- zoneStatus : 0
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- iasCieAddr : 0x0000000000000000
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ---- zoneId : 255
2017-10-29 23:58:00 [log] [ManagerDrivers] [sensor_natgas] [0] ------------------------------------------
*/


'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraSensorNatgas extends ZigBeeDevice
{
	onMeshInit() {

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

		/*
		this.registerCapability('alarm_water', 'genOta', {
			report: 'onOff',
			reportParser(value) {
				return value;
			},
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 6000, 1, data => {
			this.log('onOff', data);
			this.setCapabilityValue('alarm_water', data === 1);
		}, 0);*/

	}
}

module.exports = AqaraSensorNatgas;
