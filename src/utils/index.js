/**
 * Method to calculate distance between two geo points (lat, long)
 * @param {Object} point1
 * @param {Object} point2
 * @returns Distance in miles
 * ref: https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
 */
function haversineDistance(point1, point2) {
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = point1.latitude * (Math.PI / 180); // Convert degrees to radians
    const rlat2 = point2.latitude * (Math.PI / 180); // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = (point2.longitude - point1.longitude) * (Math.PI / 180); // Radian difference (longitudes)
    const miles =
        2 *
        R *
        Math.asin(
            Math.sqrt(
                Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                    Math.cos(rlat1) *
                        Math.cos(rlat2) *
                        Math.sin(difflon / 2) *
                        Math.sin(difflon / 2)
            )
        );
    return round(miles * 1.60934); //convert miles to km
}

/**
 * Method to sort array objects by given key
 * @param {Array} items
 * @param {String} selector
 * @param {Boolean} desc
 * @returns
 */
function sortBy(items, selector, desc = false) {
    return items.sort((a, b) => {
        const prevObj = a[selector];
        const curObj = b[selector];
        if (prevObj == curObj) return 0;
        return (desc ? prevObj > curObj : prevObj < curObj) ? -1 : 1;
    });
}

/**
 * Method to return current date time
 * @returns {Date}
 */
function getCurrentTime() {
    return new Date().toLocaleString();
}

/**
 * Method to get difference between two time in minutes
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Number}
 */
function getTimeDiffInMin(startTime, endTime) {
    return (new Date(endTime) - new Date(startTime)) / 60000;
}

/**
 * Method to round float number by two precision
 * @param {Float} num
 * @returns {Float}
 */
function round(num, decimalPlaces = 2) {
    num = Math.round(num + 'e' + decimalPlaces);
    return Number(num + 'e' + -decimalPlaces);
}

export { haversineDistance, sortBy, getCurrentTime, getTimeDiffInMin, round };
