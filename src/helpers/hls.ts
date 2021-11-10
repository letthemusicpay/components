interface HlsConstructor {
  Events: {
    ERROR: string
  }
  ErrorTypes: {
    NETWORK_ERROR: string
    MEDIA_ERROR: string
  }
}

interface HlsInstance {
  on: (str: string, callback: Function) => void
  startLoad: () => void
  recoverMediaError: () => void
  destroy: () => void
}

export function attachHlsToTracks (tracks: HTMLMediaElement[]): void {
  tracks.forEach((track) => {
    if (track == null) return
    if (track.dataset.hlsAttached === 'true') return

    let src = track.src
    if (src == null) return
    src = src.trim()

    // @ts-expect-error
    const Hls = window.Hls

    if (Hls == null) return

    if (Hls.isSupported() === true) {
      const hls = new Hls()
      handleHlsErrors(Hls, hls)

      hls.loadSource(src)
      hls.attachMedia(track)

      track.dataset.hlsAttached = 'true'
      return
    }

    console.error("This is a legacy browser that doesn't support MSE")
  })
}

// https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlsrecovermediaerror
function handleHlsErrors (hlsConstructor: HlsConstructor, hlsInstance: HlsInstance): void {
  hlsInstance.on(hlsConstructor.Events.ERROR, function (_event: unknown, data: Record<string, unknown>) {
    console.log("Error encountered: ", data)
    // if (data.fatal === false) return

    switch (data.type) {
      case hlsConstructor.ErrorTypes.NETWORK_ERROR:
        console.log('fatal network error encountered, attempting to recover...')
        hlsInstance.startLoad()
        break
      case hlsConstructor.ErrorTypes.MEDIA_ERROR:
        console.log('fatal media error encountered, attempting to recover...')
        hlsInstance.recoverMediaError()
        break
      default:
        // cannot recover
        if (data.fatal) {
          console.error('Fatal error occurred. Unable to recover.')
          console.error(data)
          hlsInstance.destroy()
        }
        break
    }
  })
}
