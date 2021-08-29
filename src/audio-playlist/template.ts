import { html, slotted, elements, ref } from '@microsoft/fast-element'
import type { AudioPlaylist } from './audioPlaylist'
import type { ViewTemplate } from '@microsoft/fast-element'
import { Icons } from './icons'

export const template: ViewTemplate = html<AudioPlaylist>`
  ${x => {
    if (x.controls) return defaultControls()
  }}
  <slot ${slotted({ property: 'tracks', filter: elements('audio') })}
        @slotchange=${x => x.handleSlotChange()}>
  </slot>

  <slot name="controls">
  </slot>
`

function defaultControls (): ViewTemplate {
  return (html<AudioPlaylist>`
  <div class="audio-playlist__controls" ?hidden="${x => !x.controls}">
    <div part="preview" class="audio-playlist__preview" ${ref('timePreview')}>
    </div>

    <playlist-progress-bar part="progress-bar" ${ref('progressBar')}
                          :percentage="${x => x.currentTrackPercentage}"
                          @pointerenter=${(x, c) => x.handlePointerEnter(c.event as PointerEvent)}
                          @pointerdown=${(x, c) => x.handlePointerDown(c.event as PointerEvent)}
                          @pointermove=${(x, c) => x.handleProgressBarHover(c.event as PointerEvent)}
                          @pointerleave=${(x, c) => x.handlePointerLeave(c.event as PointerEvent)}
                          @pointerup=${x => x.handlePointerUp()}
                          >
    </playlist-progress-bar>

    <div part="controls" class="audio-playlist__buttons">
      <div>
        <button title="Previous" @click=${x => x.previous()}>
          ${Icons.previous}
        </button>

        <button title="${x => x.playing ? 'Pause' : 'Play'}" @click=${(x, c) => x.togglePlay(c.event)}>
          <div ?hidden="${x => x.playing}">
            ${Icons.play}
          </div>
          <div ?hidden="${x => x.paused}">
            ${Icons.pause}
          </div>
        </button>

        <button title="Next" @click=${x => x.next()}>
          ${Icons.next}
        </button>
      </div>

      <div class="audio-playlist__track-time">
        <span>
          ${x => x.formattedTrackTime}
        </span>
        /
        <span>
          ${x => x.formattedTrackDuration}
        </span>
      </div>

      <span>
        ${x => x.currentTrackTitle}
      </span>

      <div>
        <button class="volume-button" title="Toggle mute" @click=${(x, c) => x.toggleMute(c.event)}>
          <div class="volume-slider__wrapper">
            <input class="volume-slider" type="range" min="0" max="100" step="any" value="0"
                   ${ref('volumeSlider')}
                   @input=${(x, c) => x.handleVolumeChange(c.event)}>
          </div>

          <div ?hidden="${x => x.muted}">
            ${Icons.volume}
          </div>

          <div ?hidden="${x => !x.muted}">
            ${Icons.mute}
          </div>
        </button>

        <button title="Turn ${x => x.shuffle ? 'off shuffle' : 'on shuffle'}" @click=${x => x.toggleShuffle()}>
          <div ?hidden="${x => x.shuffle}">
            ${Icons.order}
          </div>
          <div ?hidden="${x => !x.shuffle}">
            ${Icons.shuffle}
          </div>
        </button>

        <button title="Turn ${x => x.repeat ? 'off repeat' : 'on repeat'}" @click=${x => x.toggleRepeat()}>
          <div ?hidden="${x => !x.repeat}">
            ${Icons.repeat}
          </div>
          <div ?hidden="${x => x.repeat}">
            ${Icons.dontRepeat}
          </div>
        </button>
      </div>
    </div>
  </div>
`)
}
