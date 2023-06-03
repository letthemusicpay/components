# Purpose

A collection of web components used by
[RCRDSHP](https://app.rcrdshp.com/) to enable better user
experience.

## Current Elements:

- `<audio-playlist>`

## Installation

```bash
npm install @ltmp/components

# OR

yarn add @ltmp/components
```

Then in your entrypoint file:

```js
import "@ltmp/components"
```

Or if you want to cherrypick:

```js
import "@ltmp/components/dist/components/audio-playlist"
```

LTMP components are self-executing so they will register
for you.

## Documentation

### `<audio-playlist>`

The `<audio-playlist>` is a web component designed to make it easy to
setup a playlist.

The `<audio-playlist>` elements has a number of internal methods you can
use to create your own controls.

#### Controls

`<audio-playlist controls></audio-playlist>` will render an
audio-playlist with controls on it for play, pause, forward, backwards,
scrubbing, etc.

#### Hls

To use hls, you must first bind
[hls.js](https://github.com/video-dev/hls.js/) to the window. If your
bundler doesnt support UMD format, you may have to import Hls from a CDN
and attach it to `window.Hls`. Regardless, the audio-playlist component
will look for `window.Hls` from hls.js to be able to attach HLS
behavior.

Once you have `window.Hls` bound, you can do this:

`<audio-playlist controls hls></audio-playlist>` and then you have an
HLS audio playlist player!

## Running locally

```bash
git clone git@github.com/letthemusicpay/components.git
cd components
yarn install
yarn start
```


