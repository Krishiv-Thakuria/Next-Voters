export const handleSetPreference = (
  election: string,
  region: string,
  party: string,
) => {
  window.localStorage.setItem(
    'preference',
    JSON.stringify({
      election,
      region,
      party,
    })
  )
}

export const handleGetPreference = () => {
    const preference = window.localStorage.getItem('preference')
    const preferenceJSON = preference ? JSON.parse(preference) : null
    return preferenceJSON
}