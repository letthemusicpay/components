# Purpose

A reusable template for getting started with Microsoft's FAST Element
web component library.

## What's included?

- Typescript setup
- Web-dev-server
- Web-test-runner
- Initial structure
- Example counter component with tests.
- Changelog generation with `standard-changelog`
- Linting with `ts-standard`
- [Custom Elements manifest generation](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/)

## Getting started

Click the `clone from template` button on Github.

Then, in your new repo do the following:

```bash
yarn install
yarn start
```

Navigate to `localhost:8000` and find the magic of the counter
component.

## Moving forward

Check out the `package.json` for all possible scripts.

## Documentation

### `<audio-playlist>`

The `<audio-playlist>` is a web component designed to make it easy to
setup a playlist.

The `<audio-playlist>` elements has a number of internal methods you can
use to create your own controls.

#### Usage

```js
import "@ltmp/components"
```

##### Controls

`<audio-playlist controls></audio-playlist>` will render an
audio-playlist with controls on it for play, pause, forward, backwards,
scrubbing, etc.

##### Hls

To use hls, you must first bind
[hls.js](https://github.com/video-dev/hls.js/) to the window. If your
bundler doesnt support UMD format, you may have to import Hls from a CDN
and attach it to `window.Hls`. Regardless, the audio-playlist component
will look for `window.Hls` from hls.js to be able to attach HLS
behavior.

Once you have `window.Hls` bound, you can do this:

`<audio-playlist controls hls></audio-playlist>` and then you have an
HLS audio playlist player!
