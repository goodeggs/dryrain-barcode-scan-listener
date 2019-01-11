// Sorry, eslint. We didn't name this.
// eslint-disable-next-line goodeggs/typescript-class-name-casing
interface DT_DecoderDataResponse {
  (barcode: string): void;
  addHandler(onScan: OnScan): void;
  removeHandler(onScan: OnScan): void;
}

// Exposed for internal (testing) use only.
export interface DryrainApi {
  DT_DecoderDataResponse?: DT_DecoderDataResponse;
}

const createScanListener = (): DT_DecoderDataResponse => {
  const handlers: OnScan[] = [];
  return Object.assign((barcode: string) => handlers.forEach((handler) => handler(barcode)), {
    addHandler(handler: OnScan) {
      handlers.push(handler);
    },
    removeHandler(handler: OnScan) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    },
  });
};

export interface OnScan {
  (barcode: string): unknown;
}

export interface CreateDryrainBarcodeScanListenerConfig {
  // The object where the Dryrain API is installed (generally `window`).
  dryrainApi?: DryrainApi;
  // A handler function called whenever Dryrain successfully decodes a barcode (a scan).
  onScan: OnScan;
}

/**
 * Creates and installs a listener for scan events inside Dryrain Technologies' Enterprise Browser.
 *
 * @returns A function that, when invoked, removes the scan listener.
 */
const createDryrainBarcodeScanListener = ({
  dryrainApi = (window as unknown) as DryrainApi,
  onScan,
}: CreateDryrainBarcodeScanListenerConfig): (() => void) => {
  // Dryrain Technologies' Enterprise Browser calls this function, if defined, whenever a barcode is
  // scanned within the app. API documentation is not publicly available.
  //
  // See http://dryraintechnologies.com for more information.
  if (typeof dryrainApi.DT_DecoderDataResponse !== 'function') {
    dryrainApi.DT_DecoderDataResponse = createScanListener();
  }

  const handler = (barcode: string): unknown => onScan(barcode);
  dryrainApi.DT_DecoderDataResponse.addHandler(handler);

  return () => {
    if (typeof dryrainApi.DT_DecoderDataResponse !== 'function') {
      // This case will virtually never happen given that we just installed this handler, so this is
      // mostly for typechecking. (Still, we'd definitely want to know if this happened.)
      throw new Error('Failed to remove Dryrain scan listener');
    }
    dryrainApi.DT_DecoderDataResponse.removeHandler(handler);
  };
};

export default createDryrainBarcodeScanListener;
