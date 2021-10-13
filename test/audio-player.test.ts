import { assert, fixture } from '@open-wc/testing'
import sinon from 'sinon'

import { audioObjects, audioTags } from './helpers'
import { AudioPlaylist } from '../src/audio-playlist'

const tag = `${AudioPlaylist.tagName} controls`

// Must stub play otherwise browser doesnt like us trying to play a video.
function stubPlay (elements: HTMLMediaElement[]): void {
  elements.forEach((element) => {
    sinon.stub(element, 'play').callsFake(async () => await Promise.resolve())
  })
}

describe('AudioPlayer', () => {
  afterEach(() => sinon.restore())
  it('Should play and adjust volume', async () => {
    const el = await fixture<AudioPlaylist>(`
      <${tag}>
        ${audioTags}
      </${tag}>
    `)

    stubPlay(el.tracks);
    (el.shadowRoot.querySelector('[title="Play"]') as HTMLButtonElement).click()

    assert.equal(el.volume, 0.5)
  })
  it('plays by id', async () => {
    const el = await fixture<AudioPlaylist>(`
      <${tag}>
        ${audioTags}
      </${tag}>
    `)

    stubPlay(el.tracks);

    (el.shadowRoot.querySelector('[title="Play"]') as HTMLButtonElement).click()

    assert.equal(el.currentTrackElement.id, audioObjects[0].id)

    await el.playById(audioObjects[2].id)
    assert.equal(el.currentTrackElement.id, audioObjects[2].id)
  })

  it('plays by index', async (): Promise<void> => {
    const el = await fixture<AudioPlaylist>(`
      <${tag}>
        ${audioTags}
      </${tag}>
    `)

    stubPlay(el.tracks);
    (el.shadowRoot.querySelector('[title="Pause"]') as HTMLButtonElement).click()
    assert.equal(el.currentTrackElement.id, audioObjects[0].id)

    await el.playByIndex(3)
    assert.equal(el.currentTrackElement.id, audioObjects[3].id)
  })

  it('plays by title', async (): Promise<void> => {
    const el = await fixture<AudioPlaylist>(`
      <${tag}>
        ${audioTags}
      </${tag}>
    `)

    stubPlay(el.tracks);

    (el.shadowRoot.querySelector('[title="Pause"]') as HTMLButtonElement).click()
    assert.equal(el.currentTrackElement.id, audioObjects[0].id)

    await el.playByTitle(audioObjects[1].title)
    assert.equal(el.currentTrackElement.title, audioObjects[1].title)
  })
})
