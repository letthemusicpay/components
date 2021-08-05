import { FASTElement, attr, observable } from '@microsoft/fast-element'
import { PlaylistProgressBar } from '../playlist-progress-bar/playlistProgressBar'
import { TrackPlayEvent, TrackPauseEvent, TrackChangeEvent } from '../events'
import { displayTime } from '../helpers/displayTime'

export class AudioPlaylist extends FASTElement {
  static get tagName (): string {
    return 'audio-playlist'
  }

  @attr currentTrackNumber = 0
  @attr currentTrackPercentage = 0
  @attr currentTrackDuration = 0
  @attr currentTrackTime = 0
  @attr formattedTrackDuration = '--:--'
  @attr formattedTrackTime = '--:--'
  @attr shuffle = false
  @attr repeat = false
  @attr playing = false
  @attr paused = true
  @attr tabindex = 0
  @attr 'aria-label' = 'audio playlist player'

  @attr currentTrackTitle!: string

  @observable tracks: HTMLAudioElement[] = []

  @observable pointerIsDown = false
  @observable timePreview!: HTMLElement
  @observable currentTimeElement!: HTMLElement
  @observable progressBar!: PlaylistProgressBar

  readonly boundTick = this.tick.bind(this)
  readonly boundNext = this.next.bind(this)
  readonly boundUpdateInfo = this.updateInfo.bind(this)

  disconnectedCallback (): void {
    super.disconnectedCallback()

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

  updateInfo (): void {
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
    this.updateInfo()
    window.requestAnimationFrame(this.boundTick)
  }

  handlePointerDown (event: PointerEvent): void {
    event.preventDefault()

    this.pointerIsDown = true
    this.handlePointerLocation(event)
  }

  handlePointerMove (event: PointerEvent): void {
    event.preventDefault()

    this.displayPreview(event)

    // The pointer has to be down for us to register a pointermove
    if (!this.pointerIsDown) {
      return
    }

    this.handlePointerLocation(event)
  }

  handlePointerUp (): void {
    this.pointerIsDown = false
  }

  handlePointerEnter (event: PointerEvent): void {
    event.preventDefault()
    this.displayPreview(event)
  }

  handlePointerLeave (event: PointerEvent): void {
    event.preventDefault()
    this.timePreview.hidden = true
  }

  handlePointerLocation (event: PointerEvent): void {
    event.preventDefault()

    const pointerLocation = this.getPointerLocation(event)
    const currentTime = this.getTimeAtPointerLocation(pointerLocation)
    this.currentTrackElement.currentTime = currentTime
    const duration = this.currentTrackElement.duration
    this.currentTrackPercentage = (currentTime / duration) * 100
    this.currentTrackTime = currentTime
    this.updateFormattedTimes()
    this.pause()
  }

  displayPreview (event: PointerEvent): void {
    event.preventDefault()

    const pointerLocation = this.getPointerLocation(event)
    const timePreviewWidth = this.timePreview.getBoundingClientRect().width
    const currentTime = this.getTimeAtPointerLocation(pointerLocation)

    if (currentTime == null || currentTime < -1 || isNaN(currentTime)) {
      return
    }

    this.timePreview.hidden = false
    this.timePreview.innerText = displayTime(currentTime)
    this.timePreview.style.left = `calc(${pointerLocation * 100}% - ${timePreviewWidth / 2}px)`
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
