import { css } from '@microsoft/fast-element'

import { normalize } from '../normalize'
import { volumeVars, volumeStyles } from './volumeSliderStyles'

export const styles = css`
  ${normalize}

  :host {
    ${volumeVars}
    display: flex;
    position: relative;
    align-items: center;
    flex-direction: column;
    width: 100%;
    outline: none;
  }

  ${volumeStyles}

  button ::slotted(*) {
    height: 100%;
    width: 100%;
  }

  .buttons {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
  }

  playlist-progress-bar::part(base) {
    border-radius: 0;
    cursor: pointer;
  }

  .audio-playlist__controls {
    width: 100%;
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
    text-align: center;
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
    top: 2.2em;
    left: 0;
  }

  .volume-button {
    position: relative;
  }

  /* Not 100% accurate, but assume only fine pointing devices can adjust audio.
     This is a way to filter devices that dont support adjusting volume. */
  @media (pointer: fine) {
    .audio-playlist__preview {
      top: -1.5em;
    }
    .volume-button:hover .volume-slider__wrapper {
      display: block;
    }
  }

  .volume-slider__wrapper {
    display: none;
    position: absolute;
    top: -25%;
    left: 45%;
    padding: 0.5rem 0 0.5rem 1.5rem;
    transform: rotate(270deg);
    transform-origin: left;
  }

  .track-info {
    margin: 0.75em auto;
    width: clamp(125px, 100%, 200px);
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .track-info__artist-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }

  .track-info__title,
  .track-info__artist {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-info__artist {
    padding-bottom: 0.25em;
  }

  .track-poster {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .poster {
    border: none;
    display: block;
    max-height: 50px;
    min-width: 50px;
  }

  .audio-playlist__track-time {
    padding: 0 2em;
  }
`
