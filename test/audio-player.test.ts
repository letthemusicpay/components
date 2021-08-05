import { fixture, assert } from '@open-wc/testing'

import { AudioPlaylist } from '../src/audio-playlist'

const tag = AudioPlaylist.tagName

describe('AudioPlayer', () => {
  it('is accessible', async () => {
    const el = await fixture<AudioPlaylist>(`<${tag}></${tag}>`)
    await assert.isAccessible(el)
  })
})
