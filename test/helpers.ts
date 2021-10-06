export const audioObjects = [
  { id: 'bitbit', title: 'Bit Bit', src: 'https://freepd.com/music/Bit%20Bit%20Loop.mp3', poster: 'https://via.placeholder.com/512x512' },
  { id: 'fireworks', title: 'Fireworks', src: 'https://freepd.com/music/Fireworks.mp3' },
  { id: 'chronos', title: 'Chronos', src: 'https://freepd.com/music/Chronos.mp3' },
  { id: 'space-ambience', title: 'Space Ambience', src: 'https://freepd.com/music/Space%20Ambience.mp3' }
]

const a0 = audioObjects[0]
const a1 = audioObjects[1]
const a2 = audioObjects[2]
const a3 = audioObjects[3]

export const audioTags = `
  <audio id="${a0.id}" poster="${a0.poster ?? ''}" title="${a0.title}" src="${a0.src}"></audio>
  <audio id="${a1.id}" title="${a1.title}">
    <source src="${a1.src}">
  </audio>
  <audio id="${a2.id}" title="${a2.title}" src="${a2.src}"></audio>
  <audio id="${a3.id}" title="${a3.title}" src="${a3.src}"></audio>
`
