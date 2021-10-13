const progressBase = `
  background-color: var(--progress-color);
  border: 1px solid var(--progress-border-color);
  border-radius: var(--track-radius);
`

const progress = `
  width: var(--track-height);
  height: var(--track-width);
  ${progressBase}
`

const thumbStyles = `
  cursor: pointer;
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 50%;
  border: none;
  outline: 1px solid var(--thumb-outline);
  margin-top: calc((var(--thumb-size) / -2 + var(--track-width) / 2) - 1px);
  background-color: var(--thumb-color);
`

const trackBase = `
  background-color: var(--track-color);
  border: 1px solid var(--track-border-color);
  border-radius: var(--track-radius);
`

const track = `
  width: var(--track-height);
  height: var(--track-width);
  ${trackBase}
`

export const volumeVars = `
  --volume-height: 6rem;
  --volume-width: 1rem;

  --track-height: 100%;
  --track-width: 4px;
  --track-radius: 6px;
  --track-color: lightgray;
  --track-border-color: gray;

  --thumb-outline: dodgerblue;
  --thumb-color: dodgerblue;
  --thumb-size: 16px;

  --progress-color: #007aff;
  --progress-border-color: #007aff;
`

export const volumeStyles = `
  .volume-slider {
    -webkit-appearance: none;
    appearance: none;
    vertical-align: middle;
    height: var(--volume-width);
    width: var(--volume-height);
    background: transparent;
    cursor: pointer;
    border-radius: 3px;
  }

  .volume-slider::-webkit-slider-runnable-track {
    ${track}
    background: linear-gradient(to right, var(--progress-color) 0%, var(--progress-color) var(--progress-percent), var(--track-color) var(--progress-percent), var(--track-color) 100%);
  }

  .volume-slider::-moz-range-track {
    ${track}
  }

  .volume-slider::-moz-range-progress {
    ${progress}
  }

  /* https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */
  /* Special styling for WebKit/Blink */
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    ${thumbStyles}
  }

  /* All the same stuff for Firefox */
  .volume-slider::-moz-range-thumb {
    ${thumbStyles}
  }

  /* All the same stuff for IE */
  .volume-slider::-ms-thumb {
    ${thumbStyles}
  }

  .volume-slider::-ms-fill-upper {
    ${trackBase}
  }

  .volume-slider::-ms-fill-lower {
    ${progressBase}
  }
`
