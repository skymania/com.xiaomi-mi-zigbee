'use strict';

const { IASZoneCluster, ZCLDataTypes } = require('zigbee-clusters');

class XiaomiSpecificIASZoneCluster extends IASZoneCluster {

  // Here we override the `COMMANDS` getter from the `ScenesClusters` by
  // extending it with the custom command we'd like to implement `ikeaSceneMove`.
  static get COMMANDS() {
    return {
      ...super.COMMANDS,
    };
  }

  // It is also possible to implement manufacturer specific attributes, but beware, do not mix
  // these with regular attributes in one command (e.g. `Cluster#readAttributes` should be
  // called with only manufacturer specific attributes or only with regular attributes).
  static get ATTRIBUTES() {
    return {
      ...super.ATTRIBUTES,
      xiaomiSensorSensitivity: {
        id: 0xfff0,
        type: ZCLDataTypes.uint32,
        manufacturerId: 0x1037,
      },
      xiaomiSensorDensity: {
        id: 0xfff1,
        type: ZCLDataTypes.uint32,
        manufacturerId: 0x1037,
      },
    };
  }

}

module.exports = XiaomiSpecificIASZoneCluster;
