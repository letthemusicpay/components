import { css } from '@microsoft/fast-element'

import { normalize } from '../normalize'

const volumeSliderStyles = `
  cursor: pointer;
`

export const styles = css`
  ${normalize}

  :host {
    display: flex;
    position: relative;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 1em 0;
    outline: none;
  }

  playlist-progress-bar::part(base) {
    border-radius: 0;
    cursor: pointer;
  }

  .audio-playlist__controls {
    width: 100%;
    height: 100%;
  }

  .audio-playlist__progress-bar {
    width: 100%;
  }

  .audio-playlist__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 0 1em;
  }

  .audio-playlist__buttons > * {
    margin: 1em auto;
  }

  .audio-playlist__buttons > *:last-child,
  .audio-playlist__buttons > *:first-child {
    margin: 1em 0;
  }

  .audio-playlist__preview {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
  }

  .volume-button {
    position: relative;
  }

  /* Not 100% accurate, but assume only fine pointing devices can adjust audio.
     This is a way to filter devices that dont support adjusting volume. */
  @media (pointer: fine) {
    .volume-button:hover .volume-slider__wrapper {
      display: block;
    }
  }

  .volume-slider__wrapper {
    display: none;
    position: absolute;
    top: -130%;
    left: 45%;
    padding: 2rem 0 2rem 1.5rem;
    transform: rotate(270deg);
    transform-origin: left;
  }

  .volume-slider {
    height: 1rem;
    width: 6rem;
    cursor: pointer;
  }

  .volume-slider::-ms-track {
    width: 100%;
    cursor: pointer;
  }

  /* Special styling for WebKit/Blink */
  .volume-slider::-webkit-slider-thumb {
    ${volumeSliderStyles}
  }

  /* All the same stuff for Firefox */
  .volume-slider::-moz-range-thumb {
    ${volumeSliderStyles}
  }

  /* All the same stuff for IE */
  .volume-slider::-ms-thumb {
    ${volumeSliderStyles}
  }

  .track-info {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .poster {
    margin-right: 1rem;
    height: 100%;
  }

  .poster > img {
    border: none;
    display: block;
    max-height: 50px;
    min-width: 50px;
  }

  .audio-playlist__track-time {
    padding: 0 1em;
  }
`
