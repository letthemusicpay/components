class TrackEvent extends Event {
  constructor (name: string) {
    super(name, { bubbles: true, composed: true, cancelable: false })
  }

  currentTrackElement: HTMLMediaElement | undefined
  currentTrackNumber: number | undefined
}

export class TrackPlayEvent extends TrackEvent {
  constructor () {
    super('track-play')
  }
}

export class TrackPauseEvent extends TrackEvent {
  constructor () {
    super('track-pause')
  }
}

export class TrackChangeEvent extends TrackEvent {
  constructor () {
    super('track-change')
  }
}
