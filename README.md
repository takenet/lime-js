# lime-js
> Javascript LIME implementation

[![Build Status](https://travis-ci.org/takenet/lime-js.svg)](https://travis-ci.org/takenet/lime-js)

## How to use
If you are using node.js (or webpack), simply install the `lime-js` package from the npm registry.

    npm install --save lime-js

However, if you're using vanilla JavaScript, you can install the package via npm and then include the distribution script in your file like this:
```html
<script src="./node_modules/lime-js/dist/lime.js" type="text/javascript"></script>
```

Or you can also use the script served by [npmcdn](https://npmcdn.com):
```html
<script src="https://npmcdn.com/lime-js" type="text/javascript"></script>
```

### Transports
Lime itself is a protocol specification. That means this package is meant to be used along with other packages to provide true functionality. It is meant to be used as an interface.

There are a few official packages for Lime transport classes publicly available on NPM and on our [Github](https://github.com/takenet), but we plan on building more transport classes for node.js and the browser:
- [WebSocketTransport](https://github.com/takenet/lime-transport-websocket)

## How to build
First you need to download and install the npm packages with
```
npm install
```

Then, in order to build the source code:
```
npm run build
```
or
```
npm run watch
```
