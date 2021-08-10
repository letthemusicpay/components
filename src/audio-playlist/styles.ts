import { css } from '@microsoft/fast-element'

import { normalize } from '../normalize'

export const styles = css`
  ${normalize}

  :host {
    display: flex;
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
  }

  .audio-playlist__progress-bar {
    width: 100%;
  }

  .audio-playlist__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 1em;
  }

  .audio-playlist__preview {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
  }
`
