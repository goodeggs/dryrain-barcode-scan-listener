/* eslint-env browser */

import _ from 'lodash';

export default {
  /**
   * Listen for scans inside Dryrain Technologies' Enterprise Browser with specified characteristics
   * @param  {String} scanOptions.barcodePrefix
   * @param  {RegExp} scanOptions.barcodeValueTest - RegExp defining valid scan value (not including prefix).
   * @param  {Function} scanHandler - called with the results of the scan
   * @return {Function} - removes this listener when called
   */
  onScan ({barcodePrefix, barcodeValueTest} = {}, scanHandler) {
    if (!_.isString(barcodePrefix)) {
      throw new TypeError('barcodePrefix must be a string');
    }
    if (!(barcodeValueTest instanceof RegExp)) {
      throw new TypeError('barcodeValueTest must be a regular expression');
    }
    if (!_.isFunction(scanHandler)) {
      throw new TypeError('scanHandler must be a function');
    }

    /**
     * Dryrain Technologies' Enterprise Browser calls this function, if defined, whenever a barcode is scanned
     * within the app.  API documentation is not publicly available. See http://dryraintechnologies.com.
     */
    if (!_.isFunction(window.DT_DecoderDataResponse)) {
      window.DT_DecoderDataResponse = function (barcode) { // eslint-disable-line camelcase
        window.DT_DecoderDataResponse.scanHandlers.forEach((handler) => handler(barcode));
        return true;
      };
      window.DT_DecoderDataResponse.scanHandlers = [];
    }

    const dryrainHandler = function (barcode) {
      if (barcode.match(`^${barcodePrefix}`) !== null) {
        const barcodeValue = barcode.slice(barcodePrefix.length);
        if (barcodeValueTest.test(barcodeValue)) {
          scanHandler(barcodeValue);
        }
      }
    };

    window.DT_DecoderDataResponse.scanHandlers.push(dryrainHandler);

    const removeListener = function () {
      const dryrainHandlerIndex = window.DT_DecoderDataResponse.scanHandlers.indexOf(dryrainHandler);
      if (dryrainHandlerIndex >= 0) {
        window.DT_DecoderDataResponse.scanHandlers.splice(dryrainHandlerIndex, 1);
      }
    };

    return removeListener;
  },
};
