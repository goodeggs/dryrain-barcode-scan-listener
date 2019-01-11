/* eslint-disable goodeggs/typescript-no-non-null-assertion */
import createDryrainBarcodeScanListener, {DryrainApi} from '.';

afterEach(jest.resetAllMocks);

describe('createDryrainScanListener', () => {
  // Clean up after any tests that don't explicitly pass `dryrainApi`
  afterEach(() => Reflect.deleteProperty(window, 'DT_DecoderDataResponse'));

  describe('dryrainApi', () => {
    it('installs `DT_DecoderDataResponse` onto `dryrainApi`', () => {
      const dryrainApi: DryrainApi = {};
      createDryrainBarcodeScanListener({dryrainApi, onScan: () => {}});

      expect(dryrainApi).toHaveProperty('DT_DecoderDataResponse');
    });

    it('uses `window` as `dryrainApi` by default', () => {
      createDryrainBarcodeScanListener({onScan: () => {}});

      expect(window as DryrainApi).toHaveProperty('DT_DecoderDataResponse');
    });

    it('does not replace `DT_DecoderDataResponse` if it already exists', () => {
      const dryrainApi: DryrainApi = {};
      expect(dryrainApi).not.toHaveProperty('DT_DecoderDataResponse');
      createDryrainBarcodeScanListener({dryrainApi, onScan: () => {}});
      expect(dryrainApi).toHaveProperty('DT_DecoderDataResponse');
      const currentListener = dryrainApi.DT_DecoderDataResponse;
      expect(currentListener).toBeDefined();
      createDryrainBarcodeScanListener({onScan: () => {}});
      expect(dryrainApi).toHaveProperty('DT_DecoderDataResponse', currentListener);
    });
  });

  describe('onScan', () => {
    it('calls onScan when `DT_DecoderDataResponse` is called', () => {
      const dryrainApi: DryrainApi = {};
      const onScan = jest.fn();
      createDryrainBarcodeScanListener({dryrainApi, onScan});

      expect(onScan).toHaveBeenCalledTimes(0);

      dryrainApi.DT_DecoderDataResponse!('L%123abc');

      expect(onScan).toHaveBeenCalledTimes(1);
      expect(onScan).toHaveBeenCalledWith('L%123abc');
    });

    it('works with multiple handlers', () => {
      const dryrainApi: DryrainApi = {};
      const onScan1 = jest.fn();
      createDryrainBarcodeScanListener({dryrainApi, onScan: onScan1});
      const onScan2 = jest.fn();
      createDryrainBarcodeScanListener({dryrainApi, onScan: onScan2});

      expect(onScan1).toHaveBeenCalledTimes(0);
      expect(onScan2).toHaveBeenCalledTimes(0);

      dryrainApi.DT_DecoderDataResponse!('L%mylot');

      expect(onScan1).toHaveBeenCalledTimes(1);
      expect(onScan2).toHaveBeenCalledTimes(1);
      expect(onScan1).toHaveBeenCalledWith('L%mylot');
      expect(onScan2).toHaveBeenCalledWith('L%mylot');
    });
  });

  describe('remove listener', () => {
    it('removes the handler when the returned function is called', () => {
      const dryrainApi: DryrainApi = {};
      const onScan = jest.fn();
      const removeListener = createDryrainBarcodeScanListener({dryrainApi, onScan});

      expect(onScan).toHaveBeenCalledTimes(0);

      dryrainApi.DT_DecoderDataResponse!('L%123abc');

      expect(onScan).toHaveBeenCalledTimes(1);

      removeListener();

      expect(onScan).toHaveBeenCalledTimes(1);
    });

    it('does not remove other handlers', () => {
      const dryrainApi: DryrainApi = {};
      const onScan1 = jest.fn();
      const removeListener1 = createDryrainBarcodeScanListener({dryrainApi, onScan: onScan1});
      const onScan2 = jest.fn();
      createDryrainBarcodeScanListener({dryrainApi, onScan: onScan2});

      expect(dryrainApi.DT_DecoderDataResponse).toBeDefined();
      dryrainApi.DT_DecoderDataResponse!('L%123abc');

      expect(onScan1).toHaveBeenCalledTimes(1);
      expect(onScan2).toHaveBeenCalledTimes(1);

      removeListener1();

      dryrainApi.DT_DecoderDataResponse!('T%mytreat');

      expect(onScan1).toHaveBeenCalledTimes(1);
      expect(onScan2).toHaveBeenCalledTimes(2);
    });
  });
});
