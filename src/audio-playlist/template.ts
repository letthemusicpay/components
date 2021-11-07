import { html, slotted, elements, ref } from '@microsoft/fast-element'
import type { AudioPlaylist } from './audioPlaylist'
import type { ViewTemplate } from '@microsoft/fast-element'
import * as Icons from './icons'

export const template: ViewTemplate = html<AudioPlaylist>`
  <slot id="audio-playlist-tracks" ${slotted({ property: 'tracks', filter: elements('audio') })}
        @slotchange=${x => x.handleSlotChange()}>
  </slot>

  <slot name="controls">
    ${x => {
      if (x.controls) return defaultControls()
      return undefined
    }}
  </slot>
`

function defaultControls (): ViewTemplate {
  return (html<AudioPlaylist>`
  <div class="audio-playlist__controls" ?hidden="${x => !x.controls}">
    <slot name="preview">
      <div part="preview" class="audio-playlist__preview" ${ref('timePreview')}>
      </div>
    </slot>

    <slot name="progress-bar">
      <playlist-progress-bar part="progress-bar" ${ref('progressBar')}
                            :percentage="${x => x.currentTrackPercentage}"
                            @pointerenter=${(x, c) => x.handlePointerEnter(c.event as PointerEvent)}
                            @pointerdown=${(x, c) => x.handlePointerDown(c.event as PointerEvent)}
                            @pointerleave=${(x, c) => x.handlePointerLeave(c.event as PointerEvent)}
                            @pointerup=${x => x.handlePointerUp()}
                            >
      </playlist-progress-bar>
    </slot>

    <div part="controls" class="audio-playlist__buttons">
      <div class="buttons" part="left-buttons">
        <slot name="left-buttons">
          <button part="button previous" title="Previous" @click=${async x => await x.previous()}>
            <slot name="previous">
              ${Icons.previous}
            </slot>
          </button>

          <button part="button play" title="Play" ?hidden="${x => x.playing}"
                  @click=${async (x, c) => await x.togglePlay(c.event)}>
            <slot name="play">
              ${Icons.play}
            </slot>
          </button>

          <button part="button pause" title="Pause"
                  ?hidden="${x => x.paused}"
                  @click=${async (x, c) => await x.togglePlay(c.event)}>
            <slot name="pause">
              ${Icons.pause}
            </slot>
          </button>

          <button part="button next" title="Next" @click=${async x => await x.next()}>
            <slot name="next">
              ${Icons.next}
            </slot>
          </button>

          <slot name="extra-left-buttons">
          </slot>
        </slot>
      </div>

      <slot name="track-time">
        <div part="track-time" class="audio-playlist__track-time">
          <span part="current-time">
            ${x => x.formattedTrackTime}
          </span>
          /
          <span part="duration">
            ${x => x.formattedTrackDuration}
          </span>
        </div>
      </slot>

      <slot name="track-poster">
        <div part="track-poster" class="track-poster">
          <slot name="poster">
            <img class="poster" part="poster-image" src="${x => x.currentTrackPoster}">
          </slot>
        </div>
      </slot>

      <slot name="track-info">
        <div part="track-info" class="track-info">
          <slot name="track-info">
            <div class="track-info__artist-title" part="track-artist-title">
              <div class="track-info__artist" part="track-artist" ?hidden=${x => x.currentTrackArtist == null}>
                ${x => x.currentTrackArtist}
              </div>
              <div class="track-info__title" part="track-title" ?hidden=${x => x.currentTrackTitle == null}>
                ${x => x.currentTrackTitle}
              </div>
            </div>
          </slot>
        </div>
      </slot>


      <slot name="right-buttons">
        <div class="buttons" part="right-buttons">
          <button part="button volume" class="volume-button" title="${x => x.muted ? 'Unmute' : 'Mute'}"
                  @click=${(x, c) => x.toggleMute(c.event)}>
            <div part="volume-slider-wrapper" class="volume-slider__wrapper">
              <slot name="volume-slider">
                <input part="volume-slider" class="volume-slider" type="range" min="0" max="100" step="any" value="0"
                      ${ref('volumeSlider')}
                      @input=${(x, c) => x.handleVolumeChange(c.event)}>
              </slot>
            </div>

            <slot name="volume" ?hidden="${x => x.muted}">
              ${Icons.volume}
            </slot>

            <slot name="muted" ?hidden="${x => !x.muted}">
              ${Icons.mute}
            </slot>
          </button>
          <button part="button repeat" title="Turn ${x => x.repeat ? 'off repeat' : 'on repeat'}"
                  ?hidden="${x => !x.repeat}" @click=${x => x.toggleRepeat()}>
            <slot name="repeat">
              ${Icons.repeat}
            </slot>
          </button>

          <button part="button no-repeat" title="Turn ${x => x.repeat ? 'off repeat' : 'on repeat'}"
                  ?hidden="${x => x.repeat}" @click=${x => x.toggleRepeat()}>
            <slot name="no-repeat"${x => x.repeat}">
              ${Icons.dontRepeat}
            </slot>
          </button>
          <button ?hidden="${x => x.shuffle}" part="button order"
                  title="Turn ${x => x.shuffle ? 'off shuffle' : 'on shuffle'}"
                  @click=${x => x.toggleShuffle()}>
            <slot name="order">
              ${Icons.order}
            </slot>
          </button>

          <button ?hidden="${x => !x.shuffle}" part="button shuffle"
                  title="Turn ${x => x.shuffle ? 'off shuffle' : 'on shuffle'}"
                  @click=${x => x.toggleShuffle()}>
            <slot name="shuffle">
              ${Icons.shuffle}
            </slot>
          </button>
          <slot name="extra-right-buttons">
          </slot>
        </div>
      </slot>
    </div>
  </div>
`)
}
