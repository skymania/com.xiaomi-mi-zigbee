supportedCapabilities [
  [
    'measure_battery',
    'measure_temperature',
    'measure_humidity',
    'measure_VOC',
    'measure_AirQualityLevel',
    'alarm_VOC',
    'alarm_battery'
  ],
  [
    'measure_tilt',
    'measure_tilt.relative',
    'measure_vibration',
    'alarm_vibration',
    'alarm_tilt',
    'alarm_drop',
    'alarm_battery',
    'measure_battery'
  ],
  [ 'measure_luminance', 'alarm_battery', 'measure_battery' ],
  [ 'alarm_gas', 'measure_gas_density' ],
  [ 'alarm_smoke', 'alarm_battery', 'measure_battery' ],
  [ 'onoff', 'measure_power' ],
  [ 'onoff', 'onoff.1', 'measure_power' ],
  [ 'alarm_contact', 'alarm_battery', 'measure_battery' ],
  [ 'alarm_contact', 'alarm_battery', 'measure_battery' ],
  [
    'measure_battery',
    'cube_state_motion',
    'cube_state_face',
    'cube_measure_rotation',
    'alarm_battery'
  ],
  [
    'alarm_motion',
    'measure_luminance',
    'alarm_battery',
    'measure_battery'
  ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff' ],
  [ 'onoff', 'onoff.1' ],
  [ 'onoff' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff', 'onoff.1', 'measure_power', 'meter_power' ],
  [ 'onoff' ],
  [ 'onoff' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'alarm_motion', 'measure_battery', 'alarm_battery' ],
  [
    'alarm_motion',
    'measure_luminance',
    'alarm_battery',
    'measure_battery'
  ],
  [ 'alarm_water', 'alarm_battery', 'measure_battery' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'onoff' ],
  [ 'onoff' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [
    'measure_temperature',
    'measure_humidity',
    'measure_battery',
    'alarm_battery'
  ],
  [
    'measure_battery',
    'measure_temperature',
    'measure_pressure',
    'measure_humidity',
    'alarm_battery'
  ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'measure_battery', 'alarm_battery' ],
  [ 'alarm_battery', 'measure_battery' ],
  [ 'alarm_battery', 'measure_battery' ],
  [ 'alarm_battery', 'measure_battery' ],
  [ 'onoff', 'windowcoverings_set', 'windowcoverings_state' ],
  [
    'windowcoverings_closed',
    'windowcoverings_set',
    'windowcoverings_state',
    'measure_battery',
    'button.calibrate'
  ],
  [ 'onoff', 'measure_power', 'measure_voltage', 'meter_power' ],
  [ 'onoff', 'measure_power', 'meter_power' ],
  [
    'windowcoverings_set',
    'measure_battery',
    'curtain_motor_state',
    'alarm_motor'
  ],
  [ 'onoff', 'dim', 'light_temperature' ]
]
| Device icon | Brand | Name  | Device modelID | Product Code (EAN) | Zigbee productId | Driver ID | Device capabilities | Subdevices | Deprecated
| --- | --- | --- | --- | --- | --- |  --- | --- | --- | --- |
***Sensors***|
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/airmonitor.acn01/assets/icon.svg" width="50%" height="50%"> | Aqara | TVOC Air Quality Monitor | AAQS-S01, VOCKQJK11LM | 6970504214644, 192784000595 | lumi.airmonitor.acn01 | airmonitor.acn01 | measure_battery, measure_temperature, measure_humidity, measure_VOC, measure_AirQualityLevel, alarm_VOC, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/vibration.aq1/assets/icon.svg" width="50%" height="50%"> | Aqara | Vibration Sensor | DJT11LM | 6970504210592 | lumi.vibration.aq1 | vibration.aq1 | measure_tilt, measure_tilt.relative, measure_vibration, alarm_vibration, alarm_tilt, alarm_drop, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_magnet.aq2/assets/icon.svg" width="50%" height="50%"> | Aqara | Door and Window Sensor | MCCGQ11LM | 6970504210073, 192784000083 | lumi.sensor_magnet.aq2 | sensor_magnet.aq2 | alarm_contact, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/cube/assets/icon.svg" width="50%" height="50%"> | Aqara | Cube | MFKZQ01LM | 6970504210615,  6974176874412, 192784000045 | lumi.sensor_cube, lumi.sensor_cube.aqgl01 | cube | measure_battery, cube_state_motion, cube_state_face, cube_measure_rotation, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/motion.ac02/assets/icon.svg" width="50%" height="50%"> | Aqara | Motion Sensor P1 | MS-S02 | 6970504215979 | lumi.motion.ac02 | motion.ac02 | alarm_motion, measure_luminance, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_motion.aq2/assets/icon.svg" width="50%" height="50%"> | Aqara | Motion Sensor | RTCGQ11LM | 6970504210066, 192784000090 | lumi.sensor_motion.aq2 | sensor_motion.aq2 | alarm_motion, measure_luminance, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_wleak.aq1/assets/icon.svg" width="50%" height="50%"> | Aqara | Water Leak Sensor | SJCGQ11LM | 6970504210258,  6970504210608 | lumi.sensor_wleak.aq1 | sensor_wleak.aq1 | alarm_water, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/weather/assets/icon.svg" width="50%" height="50%"> | Aqara | Temperature and Humidity Sensor | WSDCGQ11LM | 6970504210097, 192784000106 | lumi.weather | weather | measure_battery, measure_temperature, measure_pressure, measure_humidity, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sen_ill.mgl01/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Light Sensor | GZCGQ01LM | 6934177710865 | lumi.sen_ill.mgl01 | sen_ill.mgl01 | measure_luminance, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_magnet/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Door and window sensor | MCCGQ01LM | 6970244522771 | lumi.sensor_magnet | sensor_magnet | alarm_contact, alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_motion/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Occupancy sensor | RTCGQ01LM | 6970244522788 | lumi.sensor_motion | sensor_motion | alarm_motion, measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sens/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Temperature and Humidity Sensor | WSDCGQ01LM | 6970244522801 | lumi.sens, lumi.sensor_ht | sens | measure_temperature, measure_humidity, measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_natgas/assets/icon.svg" width="50%" height="50%"> | Xiaomi Honeywell | Xiaomi Honeywell Natural Gas Detector | JTQJ-BF-01LM/BW | 6953046000074 | lumi.sensor_natgas | sensor_natgas | alarm_gas, measure_gas_density | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_smoke/assets/icon.svg" width="50%" height="50%"> | Xiaomi Honeywell | Xiaomi Honeywell Smoke Detector | JTYJ-GD-01LM/BW | 6953046000074 | lumi.sensor_smoke | sensor_smoke | alarm_smoke, alarm_battery, measure_battery | No | 
***Built-in or plug-in socket switches***|
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/relay.c2acn01.2/assets/icon.svg" width="50%" height="50%"> | Aqara | Relay Controller Double - L1 | LLKZMK11LM | 6970504210714 | lumi.relay.c2acn01 | relay.c2acn01.2 | onoff, measure_power | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/relay.c2acn01/assets/icon.svg" width="50%" height="50%"> | Aqara | Relay Controller Double | LLKZMK11LM | 6970504210714 | lumi.relay.c2acn01 | relay.c2acn01 | onoff, onoff.1, measure_power | No | Yes*
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_86plug.aq1/assets/icon.svg" width="50%" height="50%"> | Aqara | Aqara Smart Socket | QBCZ11LM | 6970504210110 | lumi.ctrl_86plug, lumi.ctrl_86plug.aq1 | ctrl_86plug.aq1 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_neutral2.2/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Double (No Neutral) - Left | QBKG03LM | 6970504210028 | lumi.ctrl_neutral2 | ctrl_neutral2.2 | onoff | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_neutral2/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Double (No Neutral) | QBKG03LM | 6970504210028 | lumi.ctrl_neutral2 | ctrl_neutral2 | onoff, onoff.1 | No | Yes*
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_neutral1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Single (No Neutral) | QBKG04LM | 6970504210011 | lumi.ctrl_neutral1 | ctrl_neutral1 | onoff | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_ln1.aq1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Single (With Neutral) | QBKG11LM | 6970504210110 | lumi.ctrl_ln1, lumi.ctrl_ln1.aq1 | ctrl_ln1.aq1 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_ln2.aq1.2/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Double (With Neutral) - Left | QBKG12LM | 6970504210134 | lumi.ctrl_ln2, lumi.ctrl_ln2.aq1 | ctrl_ln2.aq1.2 | onoff, measure_power, meter_power | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/ctrl_ln2.aq1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch Double (With Neutral) | QBKG12LM | 6970504210134 | lumi.ctrl_ln2, lumi.ctrl_ln2.aq1 | ctrl_ln2.aq1 | onoff, onoff.1, measure_power, meter_power | No | Yes*
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.b1lacn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Single (No Neutral) | QBKG21LM | 6970504211643 | lumi.switch.b1lacn02 | switch.b1lacn02 | onoff | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.b2lacn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Double (No Neutral) - Left | QBKG22LM | 6970504211650 | lumi.switch.b2lacn02 | switch.b2lacn02 | onoff | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.b1nacn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Single (With Neutral) | QBKG23LM | 6970504211667 | lumi.switch.b1nacn02 | switch.b1nacn02 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.b2nacn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Double (With Neutral) - Left | QBKG24LM | 6970504211674 | lumi.switch.b2nacn02 | switch.b2nacn02 | onoff, measure_power, meter_power | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.l3acn3/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Tripple (No Neutral) - Left | QBKG25LM | 6970504211827 | lumi.switch.l3acn3 | switch.l3acn3 | onoff | Yes (2) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.n3acn3/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch D1 Tripple (with Neutral) - Left | QBKG26LM | 6970504211858 | lumi.switch.n3acn3 | switch.n3acn3 | onoff, measure_power, meter_power | Yes (2) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/plug.maeu01/assets/icon.svg" width="50%" height="50%"> | Aqara | Smart plug (EU) | SP-EUC01 | 6970504210646 | lumi.plug.maeu01 | plug.maeu01 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.n0agl1/assets/icon.svg" width="50%" height="50%"> | Aqara | Single Switch Module T1 (With Neutral) | SSM-U01 | 6970504213296 | lumi.switch.n0agl1 | switch.n0agl1 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.l0agl1/assets/icon.svg" width="50%" height="50%"> | Aqara | Single Switch Module T1 (No Neutral) | SSM-U02 | 6970504213302 | lumi.switch.l0agl1 | switch.l0agl1 | onoff | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.l1aeu1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch H1 Single (No Neutral) | WS-EUK01 | 6970504214774 | lumi.switch.l1aeu1 | switch.l1aeu1 | onoff | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.l2aeu1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch H1 Double (No Neutral) | WS-EUK02 | 6970504214781 | lumi.switch.l2aeu1 | switch.l2aeu1 | onoff | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.n1aeu1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch H1 Single (With Neutral) | WS-EUK03 | 6970504214798 | lumi.switch.n1aeu1 | switch.n1aeu1 | onoff, measure_power, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/switch.n2aeu1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wall Switch H1 Double (With Neutral) | WS-EUK04 | 6970504214804 | lumi.switch.n2aeu1 | switch.n2aeu1 | onoff, measure_power, meter_power | Yes (1) | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/plug/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Smart Socket Plug | ZNCZ02LM | 6970244522818 | lumi.plug | plug | onoff, measure_power, measure_voltage, meter_power | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/plug.mmeu01/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Smart plug (EU) | ZNCZ04LM | 6934177706493 | lumi.plug.mmeu01 | plug.mmeu01 | onoff, measure_power, meter_power | No | 
***Button or wireless switches***|
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b28ac1/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch H1 Double | WRS-R02 | 6970504215023 | lumi.remote.b28ac1 | remote.b28ac1 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_86sw2Un/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch Double | WXKG02LM | 6970504210042 | lumi.sensor_86sw2Un, lumi.sensor_86sw2 | sensor_86sw2Un | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b286acn01/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch Double (2018) | WXKG02LM | 6970504211452, 192784000076 | lumi.remote.b286acn01 | remote.b286acn01 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_86sw1lu/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch Single | WXKG03LM | 6970504211445 | lumi.sensor_86sw1lu, lumi.sensor_86sw1 | sensor_86sw1lu | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b186acn01/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch Single (2018) | WXKG03LM | 6970504211445, 192784000069 | lumi.remote.b186acn01 | remote.b186acn01 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b186acn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch D1 Single | WXKG06LM | 6970504211445 | lumi.remote.b186acn02 | remote.b186acn02 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b286acn02/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Remote Switch D1 Double | WXKG07LM | 6970504211452 | lumi.remote.b286acn02 | remote.b286acn02 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_switch.aq2/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Mini Switch | WXKG11LM | 6970504210080 | lumi.sensor_switch.aq2 | sensor_switch.aq2 | alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b1acn01/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Mini Switch (2018) | WXKG11LM | 6970504210080, 192784000052 | lumi.remote.b1acn01 | remote.b1acn01 | alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_switch.aq3/assets/icon.svg" width="50%" height="50%"> | Aqara | Wireless Mini Switch (with Gyro) | WXKG12LM | 6970504210301 | lumi.sensor_switch.aq3, lumi.sensor_swit | sensor_switch.aq3 | alarm_battery, measure_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b286opcn01/assets/icon.svg" width="50%" height="50%"> | Aqara Opple | Aqara Opple Wireless Remote Switch - 2 button | WXCJKG11LM | 6970504211964 | lumi.remote.b286opcn01 | remote.b286opcn01 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b486opcn01/assets/icon.svg" width="50%" height="50%"> | Aqara Opple | Aqara Opple Wireless Remote Switch - 4 button | WXCJKG12LM | 6970504211971 | lumi.remote.b486opcn01 | remote.b486opcn01 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/remote.b686opcn01/assets/icon.svg" width="50%" height="50%"> | Aqara Opple | Aqara Opple Wireless Remote Switch - 6 button | WXCJKG13LM | 6970504211988 | lumi.remote.b686opcn01 | remote.b686opcn01 | measure_battery, alarm_battery | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/sensor_switch/assets/icon.svg" width="50%" height="50%"> | Xiaomi | Xiaomi Wireless Mini Switch | WXKG01LM | 6970244522795 | lumi.sensor_switch | sensor_switch | measure_battery, alarm_battery | No | 
***Curtain controllers***|
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/curtain/assets/icon.svg" width="50%" height="50%"> | Aqara | Curtain Controller | ZNCLDJ11LM | 6970504210165 | lumi.curtain | curtain | onoff, windowcoverings_set, windowcoverings_state | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/curtain.hagl04/assets/icon.svg" width="50%" height="50%"> | Aqara | Curtain Controller B1 | ZNCLDJ12LM | 6970504211452,  6970504211292 | lumi.curtain.hagl04 | curtain.hagl04 | windowcoverings_closed, windowcoverings_set, windowcoverings_state, measure_battery, button.calibrate | No | 
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/curtain.acn002/assets/icon.svg" width="50%" height="50%"> | Aqara | Roller Shade Driver E1 | ZNJLBL01LM | 6970504215085 | lumi.curtain.acn002 | curtain.acn002 | windowcoverings_set, measure_battery, curtain_motor_state, alarm_motor | No | 
***Lights***|
| <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/drivers/light.aqcn02/assets/icon.svg" width="50%" height="50%"> | Aqara | LED Bulb | ZNLDP12LM | 6970504211032 | lumi.light.aqcn02 | light.aqcn02 | onoff, dim, light_temperature | No | 
* Deprecated device drivers will still continue to function but are replaced by a new driver with extended capabilities. Re-inclusion of the device is required to benefit from these new capabilities
