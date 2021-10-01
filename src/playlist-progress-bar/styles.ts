import { css } from '@microsoft/fast-element'
import { normalize } from '../normalize'

const height = '16px'
const trackColor = '#e5e7eb'
const indicatorColor = '#0ea5e9'
const textColor = 'white'

export const styles = css`
  ${normalize}

  :host {
    display: block;
    width: 100%;
    cursor: pointer;
  }

  .progress-bar__wrapper {
    position: relative;
    background-color: var(--track-color, ${trackColor});
    height: var(--height, ${height});
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    background-color: var(--indicator-color, ${indicatorColor});
    color: var(--text-color, ${textColor});
    text-align: center;
    line-height: var(--height, ${height});
    white-space: nowrap;
    overflow: hidden;
    transition: 50ms width, 50ms background-color;
    user-select: none;
  }
`
