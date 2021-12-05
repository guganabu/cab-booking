
/**
 * Method to calculate distance between two geo points (lat, long)
 * @param {Object} point1 
 * @param {Object} point2 
 * @returns Distance in miles
 * ref: https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
 */
function haversineDistance(point1, point2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = point1.latitude * (Math.PI/180); // Convert degrees to radians
    var rlat2 = point2.latitude * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (point2.longitude - point1.longitude) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
  }

  /**
   * Method to sort array objects by given key
   * @param {Array} items 
   * @param {String} selector 
   * @param {Boolean} desc 
   * @returns 
   */
  async function sortBy(items, selector, desc = false) {
    return await items.sort((a, b) => {
      const prevObj = a[selector];
      const curObj = b[selector];
      if (prevObj == curObj) return 0;
      return (desc ? prevObj > curObj : prevObj < curObj) ? -1 : 1;
    });
  };

  export {
    haversineDistance,
    sortBy
  }
