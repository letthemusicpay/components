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
  @attr currentTrackPoster: string | undefined | null
  @attr currentTrackArtist: string | undefined | null
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

  firstPlay = true
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

    this.tracks?.forEach((track) => {
      track.removeEventListener('ended', this.boundNext as EventListener)
      track.removeEventListener('loadedmetadata', this.boundUpdateInfo)
    })
  }

  addTrackListeners (): void {
    this.tracks?.forEach((track) => {
      track.addEventListener('ended', this.boundNext as EventListener)
      track.addEventListener('loadedmetadata', this.boundUpdateInfo)
    })
  }

  async previous (): Promise<void> {
    this.pause()
    this.rewind()
    this.currentTrackNumber -= 1

    // go to last track.
    if (this.currentTrackNumber < 0) {
      this.currentTrackNumber = this.tracks.length - 1
    }

    this.dispatchEvent(this.trackChangeEvent)
    await this.play()
  }

  async next (event?: Event): Promise<void> {
    this.pause()
    this.rewind()

    if (this.repeat && event?.type === 'ended') {
      await this.play()
      return
    }

    if (this.shuffle) {
      this.currentTrackNumber = this.randomTrackNumber
      await this.play()
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
    await this.play()
  }

  rewind (): void {
    if (!this.isTrack) return
    this.currentTrackElement.currentTime = 0
  }

  async togglePlay (event: Event): Promise<void> {
    if (!this.isTrack) return
    if (event.defaultPrevented) return

    event.preventDefault()

    if (this.playing) {
      this.pause()
    } else {
      await this.play()
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

  async play (): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (!this.isTrack) return resolve()

      if (this.playing) return resolve()

      // Just in case hls hasnt happened yet.
      if (this.hls && this.isTrack) {
        attachHlsToTracks([this.currentTrackElement])
      }

      this.dispatchEvent(this.trackPlayEvent)
      this.updateInfo()

      if (invalidNumber(this.previousVolume) || this.previousVolume <= 0) {
        this.previousVolume = 0.5
      }

      if (this.firstPlay) {
        this.unmute(this.previousVolume)
      }

      this.currentTrackElement.play()
        .then(() => {
          this.playing = true
          this.paused = false
          this.firstPlay = false
          this.tick()
          resolve()
        })
        .catch(() => {
          this.mute()
          this.currentTrackElement.play().then(() => {
            this.playing = true
            this.paused = false
            this.tick()
            this.firstPlay = false
            resolve()
          }).catch((err) => {
            console.error(err)
            reject(err)
          })
        })
    })
  }

  async playById (id: string): Promise<void> {
    const index = this.tracks.findIndex(el => el.id === id)
    if (index === -1) {
      console.error(`Could not play track with an id of: ${id}`)
      return
    }

    this.checkTrackChange(index)

    await this.play()
  }

  async playByIndex (num: number): Promise<void> {
    const el = this.tracks[num]

    if (el == null) {
      console.error(`Could not play track number: ${num}`)
      return
    }

    this.checkTrackChange(num)

    await this.play()
  }

  async playByTitle (title: string): Promise<void> {
    await this.playByAttribute('title', title)
  }

  async playByAttribute (attr: string, value: string): Promise<void> {
    const index = this.tracks.findIndex(el => el.getAttribute(attr) === value)

    if (index === -1) {
      console.error(`Could not play track ${attr}: ${value}`)
      return
    }

    this.checkTrackChange(index)
    await this.play()
  }

  checkTrackChange (num: number): void {
    if (this.currentTrackNumber !== num) {
      this.pause()
      this.rewind()
      this.currentTrackNumber = num
      this.dispatchEvent(this.trackChangeEvent)
    }
  }

  pause (): void {
    if (!this.isTrack) return
    if (this.paused) return

    this.currentTrackElement.pause()
    this.dispatchEvent(this.trackPauseEvent)
    window.setTimeout(() => {
      this.tracks?.forEach((track) => {
        if (track !== this.currentTrackElement) track.pause()
      })
    })
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
      let volume = this.previousVolume
      this.unmute(volume)
    } else {
      this.mute()
    }
  }

  updateInfo (): void {
    if (!this.isTrack) return
    this.currentTrackPoster = this.currentTrackElement.getAttribute('poster')
    this.currentTrackArtist = this.currentTrackElement.getAttribute('artist')

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
    if (!this.pointerIsDown) return

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
    const duration = this.currentTrackElement?.duration

    if (currentTime < 0) currentTime = 0
    if (currentTime >= duration) currentTime = duration - 1

    if (this.isTrack) {
      this.currentTrackElement.currentTime = currentTime
    }

    this.currentTrackPercentage = (currentTime / duration) * 100
    this.currentTrackTime = currentTime
    this.updateFormattedTimes()
  }

  mute (): void {
    this.muted = true

    if (this.isTrack) {
      this.currentTrackElement.volume = 0
      this.currentTrackElement.muted = true
    }

    window.requestAnimationFrame(() => {
      this.tracks?.forEach((track) => {
        track.volume = 0
        track.muted = true
      })
    })
  }

  unmute (volume: number): void {
    let vol = volume

    if (invalidNumber(vol)) vol = 0.5

    this.volume = volume
    this.muted = false

    if (this.isTrack) {
      this.currentTrackElement.volume = vol
      this.currentTrackElement.muted = false
    }
    window.requestAnimationFrame(() => {
      this.tracks?.forEach((track) => {
        track.volume = vol
        track.muted = false
      })
    })
  }

  volumeChanged (oldVolume: number, newVolume: number): void {
    const value = `${Math.floor(newVolume * 100)}`
    if (this.volumeSlider != null) {
      this.volumeSlider.value = value
      this.volumeSlider.style.setProperty('--progress-percent', value + '%')
    }

    if (oldVolume > 0) {
      this.previousVolume = oldVolume
    }

    if (newVolume <= 0) {
      this.mute()
    } else {
      this.unmute(newVolume)
    }
  }

  handleVolumeChange (event: Event): void {
    event.preventDefault()
    const volume = parseInt(this.volumeSlider.value) / 100
    this.volume = volume
  }

  handleSlotChange (): void {
    if (this.hls) {
      if (this.isTrack) {
        attachHlsToTracks([this.currentTrackElement])
      }
      // Attach to the rest of the tracks in the background.
      setTimeout(() => attachHlsToTracks(this.tracks))
    }
    this.addTrackListeners()
    this.updateInfo()
  }

  displayPreview (event: PointerEvent): void {
    event.preventDefault()

    if (this.currentTrackElement == null) return

    const pointerLocation = this.getPointerLocation(event)
    const currentTime = this.getTimeAtPointerLocation(pointerLocation)

    if (invalidNumber(currentTime)) return

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
    if (!this.isTrack) return
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
    return this.tracks?.[this.currentTrackNumber]
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

function invalidNumber (num: number): boolean {
  if (num == null || num < -1 || isNaN(num)) return true

  return false
}
