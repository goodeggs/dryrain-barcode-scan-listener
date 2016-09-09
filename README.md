# Dryrain Technologies Barcode Scan Listener

Listen for scan events inside Dryrain Technologies' Enterprise Browser iOS app.
API documentation is not publicly available. See http://dryraintechnologies.com.

## Usage
```
npm install dryrain-barcode-scan-listener --save
```

```js
import dryrainBarcodeScanListener from 'dryrain-barcode-scan-listener';

const removeScanListener = dryrainBarcodeScanListener.onScan({
  barcodePrefix: 'L%',
  barcodeValueTest: /^123.*$/,
}, function (barcode) {
  console.log(barcode);
});

// Now, scanning a barcode 'L%123abc' will log '123abc'
removeScanListener()
```

## Contributing

This module is written in ES2015 and converted to node-friendly CommonJS via
[Babel](http://babeljs.io/).

To compile the `src` directory to `build`:

```
npm run build
```

## Deploying a new version

```
npm version [major|minor|patch]
npm run build
npm publish build # publish the build directory instead of the main directory
git push --follow-tags # update github
```
