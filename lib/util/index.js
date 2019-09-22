function parseData(rawData) {
   const data = {};
   let index = 0;
   while (index < rawData.length - 2) {
     const type = rawData.readUInt8(index + 1);
     const byteLength = (type & 0x7) + 1;
     const isSigned = Boolean((type >> 3) & 1);
     try{
         data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
     } catch (err) {
       this.error('Could not parse the LifelineReport for index:', index, 'with error:', err);
       break;
     }
     index += byteLength + 2;
   }
   return data;
 }

module.exports = {
	parseData,
};
