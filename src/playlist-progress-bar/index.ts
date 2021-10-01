import { html, customElement } from '@microsoft/fast-element'
import { PlaylistProgressBar } from './playlistProgressBar'
import type { ViewTemplate } from '@microsoft/fast-element'

import { styles } from './styles'

const template: ViewTemplate = html<PlaylistProgressBar>`
  <div
    part="base"
    class="progress-bar__wrapper"
    role="progressbar"
    aria-valuemin="${x => x.min}"
    aria-valuemax="${x => x.max}"
    aria-valuenow="${x => x.percentage}"
  >
    <div part="progress-bar" class="progress-bar" style="width: ${x => `${x.percentage}%`};">
      <span part="label" class="progress-bar__label">
        <slot></slot>
      </span>
    </div>
  </div>
`
/**
 * @slot - A label to show inside the indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart progress-bar - The progress bar indicator.
 * @csspart label - The progress bar label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --background-color - The color of the background of the progress bar.
 * @cssproperty --progress-color - The color of the percentage filled in.
 * @cssproperty --text-color - The color of the text displayed on the bar.
 */
customElement({
  name: PlaylistProgressBar.tagName,
  template,
  styles
})(PlaylistProgressBar)

declare global {
  interface HTMLElementTagNameMap {
    'playlist-progress-bar': PlaylistProgressBar
  }
}
