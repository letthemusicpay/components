import { customElement } from '@microsoft/fast-element'
import { AudioPlaylist } from './audioPlaylist'
import { styles } from './styles'
import { template } from './template'
import '../playlist-progress-bar'

/**
 * @event track-play - Fires track-play when a track is started
 * @event track-pause - Fires track-pause when a track is paused
 * @event track-change - Fires when the next track, previous track, or track search happens.
 *
 * @slot - This holds all your tracks
 * @slot controls - Add or remove controls
 */
customElement({
  name: AudioPlaylist.tagName,
  styles,
  template
})(AudioPlaylist)

export { AudioPlaylist }

declare global {
  interface HTMLElementTagNameMap {
    'audio-playlist': AudioPlaylist
  }
}
