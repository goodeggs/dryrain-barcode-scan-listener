# Dryrain Technologies Barcode Scan Listener

[![Build Status](https://travis-ci.com/goodeggs/dryrain-barcode-scan-listener.svg?branch=master)](https://travis-ci.com/goodeggs/dryrain-barcode-scan-listener)

Listen for scan events inside Dryrain Technologies' Enterprise Browser iOS app. API documentation is not publicly available. See http://dryraintechnologies.com.

## Installation

To install via npm:

```
npm install dryrain-barcode-scan-listener
```

To install via yarn:

```sh
yarn add dryrain-barcode-scan-listener
```

## Usage

```js
import createDryrainBarcodeScanListener from 'dryrain-barcode-scan-listener';

// Now, scanning a barcode 'L%123abc' will log 'L%123abc'
const removeScanListener = createDryrainBarcodeScanListener({
  onScan: (barcode) => console.log(barcode),
});

// To remove the scan listener:
removeScanListener();
```
