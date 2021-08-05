import { css } from '@microsoft/fast-element'
import { normalize } from '../normalize'

export const styles = css`
  ${normalize}

  :host {
    --height: 16px;
    --background-color: #e5e7eb;
    --progress-color: #0ea5e9;
    --text-color: white;
    display: block;
    width: 100%;
  }

  .progress-bar__wrapper {
    position: relative;
    background-color: var(--background-color);
    height: var(--height);
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    background-color: var(--progress-color);
    color: var(--text-color);
    text-align: center;
    line-height: var(--height);
    white-space: nowrap;
    overflow: hidden;
    transition: 50ms width, 50ms background-color;
    user-select: none;
  }
`
