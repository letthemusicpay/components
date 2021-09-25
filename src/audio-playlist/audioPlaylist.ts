import { FASTElement, attr, observable } from '@microsoft/fast-element'
import { PlaylistProgressBar } from '../playlist-progress-bar/playlistProgressBar'
import { TrackPlayEvent, TrackPauseEvent, TrackChangeEvent } from '../events'
import { displayTime } from '../helpers/displayTime'
import { attachHlsToTracks } from '../helpers/hls'

export class AudioPlaylist extends FASTElement {
  static get tagName (): string {
    return 'audio-playlist'
  }

  @attr currentTrackNumber = 0
  @attr currentTrackPercentage = 0
  @attr currentTrackDuration = 0
  @attr currentTrackTime = 0
  @attr currentTrackPoster: string | undefined
  @attr formattedTrackDuration = '--:--'
  @attr formattedTrackTime = '--:--'
  @attr tabindex = 0
  @attr volume = 0
  @attr previousVolume = 0
  @attr 'aria-label' = 'Audio playlist player'

  @attr({ mode: 'boolean' }) shuffle = false
  @attr({ mode: 'boolean' }) repeat = false
  @attr({ mode: 'boolean' }) playing = false
  @attr({ mode: 'boolean' }) paused = true
  @attr({ mode: 'boolean' }) controls = false
  @attr({ mode: 'boolean' }) muted = true
  @attr({ mode: 'boolean' }) hls = false

  @attr currentTrackTitle!: string

  @observable tracks: HTMLAudioElement[] = []
  @observable pointerIsDown = false
  @observable timePreview!: HTMLElement
  @observable currentTimeElement!: HTMLElement
  @observable progressBar!: PlaylistProgressBar
  @observable volumeSlider!: HTMLInputElement

  readonly boundTick = this.tick.bind(this)
  readonly boundNext = this.next.bind(this)
  readonly boundUpdateInfo = this.updateInfo.bind(this)
  readonly boundHandleScrubbing = this.handleScrubbing.bind(this)
  readonly boundHandlePointerUp = this.handlePointerUp.bind(this)

  connectedCallback (): void {
    super.connectedCallback()
    document.addEventListener('pointermove', this.boundHandleScrubbing as EventListener)
    document.addEventListener('pointerup', this.boundHandlePointerUp as EventListener)
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()

    document.removeEventListener('pointermove', this.boundHandleScrubbing as EventListener)
    document.removeEventListener('pointerup', this.boundHandlePointerUp as EventListener)

    this.tracks.forEach((track) => {
      track.removeEventListener('ended', this.boundNext)
      track.removeEventListener('loadedmetadata', this.boundUpdateInfo)
    })
  }

  addTrackListeners (): void {
    this.tracks.forEach((track) => {
      track.addEventListener('ended', this.boundNext)
      track.addEventListener('loadedmetadata', this.boundUpdateInfo)
    })
  }

  previous (): void {
    this.pause()
    this.rewind()
    this.currentTrackNumber -= 1

    // go to last track.
    if (this.currentTrackNumber < 0) {
      this.currentTrackNumber = this.tracks.length - 1
    }

    this.dispatchEvent(this.trackChangeEvent)
    this.play()
  }

  next (event?: Event): void {
    this.pause()
    this.rewind()

    if (this.repeat && event?.type === 'ended') {
      this.play()
      return
    }

    if (this.shuffle) {
      this.currentTrackNumber = this.randomTrackNumber
      this.play()
      return
    }

    const nextTrackNumber = this.currentTrackNumber + 1

    if (nextTrackNumber > this.tracks.length - 1) {
      // Repeat to beginning only for click events
      if (event?.type === 'ended') return

      this.currentTrackNumber = 0
    } else {
      this.currentTrackNumber = nextTrackNumber
    }

    this.dispatchEvent(this.trackChangeEvent)
    this.play()
  }

  rewind (): void {
    if (!this.isTrack) return
    this.currentTrackElement.currentTime = 0
  }

  togglePlay (event: Event): void {
    if (!this.isTrack) return
    if (event.defaultPrevented) return

    event.preventDefault()

    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  get randomTrackNumber (): number {
    const randomNum = Math.floor(Math.random() * this.tracks.length)

    if (randomNum !== this.currentTrackNumber) return randomNum

    if (randomNum === this.tracks.length - 1) {
      return 0
    }

    return randomNum + 1
  }

  get isTrack (): boolean {
    return this.currentTrackElement instanceof HTMLMediaElement
  }

  play (): void {
    if (!this.isTrack) return
    if (this.playing) return

    this.dispatchEvent(this.trackPlayEvent)
    this.updateInfo()
    this.currentTrackElement.play()
      .then(() => {
        this.playing = true
        this.paused = false
        this.tick()
      })
      .catch((err) => {
        console.error(err)
        this.playing = false
        this.paused = true
      })
  }

  pause (): void {
    if (!this.isTrack) return
    if (this.paused) return

    this.currentTrackElement.pause()
    this.dispatchEvent(this.trackPauseEvent)
    this.paused = true
    this.playing = false
  }

  toggleShuffle (): void {
    if (this.shuffle) {
      this.shuffle = false
    } else {
      this.shuffle = true
    }
  }

  toggleRepeat (): void {
    if (this.repeat) {
      this.repeat = false
    } else {
      this.repeat = true
    }
  }

  toggleMute (event: Event): void {
    if (event.target === this.volumeSlider) return

    if (this.muted) {
      this.muted = false
      let volume = this.previousVolume
      if (volume <= 0 || isNaN(volume)) volume = 1
      this.changeVolume(volume)
    } else {
      this.muted = true
      this.volume = 0
      this.changeVolume(0)
    }
  }

  updateInfo (): void {
    // @ts-expect-error (poster is non-standard)
    this.currentTrackPoster = this.currentTrackElement.getAttribute('poster')
    this.currentTrackTitle = this.currentTrackElement.title
    this.currentTrackDuration = this.currentTrackElement.duration
    this.updateFormattedTimes()
  }

  updateFormattedTimes (): void {
    this.formattedTrackTime = displayTime(this.currentTrackTime)
    this.formattedTrackDuration = displayTime(this.currentTrackDuration)
  }

  /**
   * This function is the basis of the progress bar. This calls itself recursively
   *   to keep the progress bar up to date. Perhaps this more do more in the future...
   *   this gets called 60 times per second
   */
  tick (): void {
    if (!this.isTrack) return
    if (this.paused) return

    const { currentTime, duration } = this.currentTrackElement
    this.currentTrackPercentage = (currentTime / duration) * 100
    this.currentTrackTime = currentTime
    this.updateFormattedTimes()
    window.requestAnimationFrame(this.boundTick)
  }

  handlePointerDown (event: PointerEvent): void {
    event.preventDefault()

    this.pointerIsDown = true
    this.handlePointerLocation(event)
  }

  handlePointerLeave (event: PointerEvent): void {
    event.preventDefault()

    if (this.pointerIsDown) return

    if (this.timePreview != null) this.timePreview.hidden = true
  }

  handleProgressBarHover (event: PointerEvent): void {
    event.preventDefault()

    this.displayPreview(event)
  }

  handleScrubbing (event: PointerEvent): void {
    event.preventDefault()

    // The pointer has to be down for us to register a pointermove
    if (!this.pointerIsDown) {
      return
    }

    this.displayPreview(event)
    this.handlePointerLocation(event)
  }

  handlePointerUp (): void {
    this.pointerIsDown = false
    if (this.timePreview != null) this.timePreview.hidden = true
  }

  handlePointerEnter (event: PointerEvent): void {
    event.preventDefault()
    this.displayPreview(event)
  }

  handlePointerLocation (event: PointerEvent): void {
    event.preventDefault()

    const pointerLocation = this.getPointerLocation(event)
    let currentTime = this.getTimeAtPointerLocation(pointerLocation)
    const duration = this.currentTrackElement.duration

    if (currentTime < 0) currentTime = 0
    if (currentTime >= duration) currentTime = duration - 1

    this.currentTrackElement.currentTime = currentTime
    this.currentTrackPercentage = (currentTime / duration) * 100
    this.currentTrackTime = currentTime
    this.updateFormattedTimes()
  }

  changeVolume (volume: number): void {
    this.volume = volume
    const value = `${Math.floor(volume * 100)}`
    if (this.volumeSlider != null) this.volumeSlider.value = value

    if (volume <= 0) {
      this.muted = true
      this.currentTrackElement.volume = 0
      setTimeout(() => {
        this.tracks.forEach((track) => {
          track.volume = 0
          track.muted = true
        })
      }, 0)
    } else {
      this.previousVolume = volume
      this.muted = false
      this.currentTrackElement.volume = volume
      this.currentTrackElement.muted = false
      setTimeout(() => {
        this.tracks.forEach((track) => {
          track.volume = volume
          track.muted = false
        })
      }, 0)
    }
  }

  handleVolumeChange (event: Event): void {
    event.preventDefault()
    const volume = parseInt(this.volumeSlider.value) / 100
    this.changeVolume(volume)
  }

  handleSlotChange (): void {
    if (this.hls) attachHlsToTracks(this.tracks)
    this.addTrackListeners()
    this.changeVolume(this.volume)
    this.updateInfo()
  }

  displayPreview (event: PointerEvent): void {
    event.preventDefault()

    const pointerLocation = this.getPointerLocation(event)
    const currentTime = this.getTimeAtPointerLocation(pointerLocation)

    if (currentTime == null || currentTime < -1 || isNaN(currentTime)) {
      return
    }

    if (this.timePreview != null) {
      const timePreviewWidth = this.timePreview.getBoundingClientRect().width
      this.timePreview.hidden = false
      this.timePreview.innerText = displayTime(currentTime)
      this.timePreview.style.left = `calc(${pointerLocation * 100}% - ${timePreviewWidth / 2}px)`
    }
  }

  getPointerLocation (event: PointerEvent): number {
    const frameRect = this.progressBar.getBoundingClientRect()

    // find the offset of the progressbar and the actual X location of the event
    const x = event.clientX - frameRect.left
    const pos = x / frameRect.width

    return pos
  }

  getTimeAtPointerLocation (pointerLocation: number): number {
    return pointerLocation * this.currentTrackDuration
  }

  incrementCurrentTime (seconds: number): void {
    const currentTime = this.currentTrackTime + seconds
    this.updateCurrentTime(currentTime)
  }

  decrementCurrentTime (seconds: number): void {
    const currentTime = this.currentTrackTime - seconds
    this.updateCurrentTime(currentTime)
  }

  updateCurrentTime (currentTime: number): void {
    if (!this.withinTrackLimits(currentTime)) {
      return
    }

    this.currentTrackElement.currentTime = currentTime
    this.currentTrackTime = currentTime
    this.currentTrackPercentage = (this.currentTrackTime / this.currentTrackDuration) * 100
    this.updateInfo()
  }

  withinTrackLimits (time: number): boolean {
    return (time <= this.currentTrackDuration && time >= 0)
  }

  get currentTrackElement (): HTMLMediaElement {
    return this.tracks[this.currentTrackNumber]
  }

  get trackPlayEvent (): TrackPlayEvent {
    const event = new TrackPlayEvent()
    event.currentTrackElement = this.currentTrackElement
    event.currentTrackNumber = this.currentTrackNumber
    return event
  }

  get trackPauseEvent (): TrackPauseEvent {
    const event = new TrackPauseEvent()
    event.currentTrackElement = this.currentTrackElement
    event.currentTrackNumber = this.currentTrackNumber
    return event
  }

  get trackChangeEvent (): TrackChangeEvent {
    const event = new TrackChangeEvent()
    event.currentTrackElement = this.currentTrackElement
    event.currentTrackNumber = this.currentTrackNumber
    return event
  }
}
