export function attachHlsToTracks (tracks: HTMLMediaElement[]): void {
  tracks.forEach((track) => {
    if (track.dataset.hlsAttached === 'true') return

    let src = track.src
    if (src == null) return
    src = src.trim()

    // @ts-expect-error
    if (window.Hls != null && window.Hls.isSupported() === true) {
      // @ts-expect-error
      const hls = new window.Hls()
      hls.loadSource(src)
      hls.attachMedia(track)

      track.dataset.hlsAttached = 'true'
      return
    }

    console.error("This is a legacy browser that doesn't support MSE")
  })
}
