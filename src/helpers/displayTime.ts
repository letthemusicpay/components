/**
 * Returns a neatly formatted string for a given number of seconds.
 */
export function displayTime (seconds: number): string {
  if (seconds == null || seconds < 0) return '0:00'

  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60

  const ary = []

  if (hours > 1) ary.push(formatHoursAndMinutes(hours))

  ary.push(formatHoursAndMinutes(minutes))
  ary.push(formatSeconds(seconds % 60))

  return ary.join(':')
}

function formatSeconds (val: number): string {
  return `0${Math.floor(val)}`.slice(-2)
}

function formatHoursAndMinutes (val: number): string {
  if (val > 10) {
    return formatSeconds(val)
  }

  return `${Math.floor(val)}`.slice(-2)
}
