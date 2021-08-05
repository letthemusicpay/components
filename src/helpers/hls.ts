import Hls from 'hls.js'

export function attachHlsToTracks (tracks: HTMLMediaElement[]): void {
  tracks.forEach(track => {
    const src = track.src

    if (track.src == null || track.src.trim() === '') return

    if (track.canPlayType('application/vnd.apple.mpegurl') !== '') {
      // Some browers (safari and ie edge) support HLS natively
      return
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(track)
      return
    }

    console.error("This is a legacy browser that doesn't support MSE")
  })
}
