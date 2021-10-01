import { FASTElement, attr } from '@microsoft/fast-element'

export class PlaylistProgressBar extends FASTElement {
  static get tagName (): string {
    return 'playlist-progress-bar'
  }

  /** The progress bar's percentage, 0 to 100. */
  @attr percentage = 0
  @attr min = 0
  @attr max = 100
}
