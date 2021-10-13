import { assert } from '@open-wc/testing'
import { displayTime } from '../src/helpers/displayTime'
it(('should properly display time'), () => {
  let seconds = 3600
  assert.equal('1:00:00', displayTime(seconds))

  seconds = 3601
  assert.equal('1:00:01', displayTime(seconds))

  seconds = 3611
  assert.equal('1:00:11', displayTime(seconds))

  seconds = 3660
  assert.equal('1:01:00', displayTime(seconds))

  seconds = 60
  assert.equal('1:00', displayTime(seconds))

  seconds = 61
  assert.equal('1:01', displayTime(seconds))

  seconds = 70
  assert.equal('1:10', displayTime(seconds))

  seconds = 71
  assert.equal('1:11', displayTime(seconds))

  seconds = 9
  assert.equal('0:09', displayTime(seconds))

  seconds = 1
  assert.equal('0:01', displayTime(seconds))

  seconds = -1
  assert.equal('0:00', displayTime(seconds))

  seconds = 0
  assert.equal('0:00', displayTime(seconds))
})
