/**
 * Returns a neatly formatted string for a given number of seconds.
 */
export function displayTime (seconds: number): string {
  if (seconds == null || isNaN(seconds) || seconds < 0) return '0:00'

  const hours = seconds / 3600
  const minutes = (seconds % 3600) / 60

  const ary = []

  if (hours >= 1) {
    ary.push(formatWithoutLeadingZero(hours))
    ary.push(formatWithLeadingZero(minutes))
  } else {
    ary.push(formatWithoutLeadingZero(minutes))
  }

  ary.push(formatWithLeadingZero(seconds % 60))

  return ary.join(':')
}

function formatWithLeadingZero (val: number): string {
  return `0${Math.floor(val)}`.slice(-2)
}

function formatWithoutLeadingZero (val: number): string {
  if (val >= 10) {
    return formatWithLeadingZero(val)
  }

  return `${Math.floor(val)}`.slice(-2)
}
