import {fetch} from 'undici'
import {logger} from './logger'

interface SunTimes {
  sunrise: string
  sunset: string
  solarNoon: string
}

interface SunTimesApiResponse {
  status: string
  results: {
    sunrise: string
    sunset: string
    solar_noon: string
    day_length?: string
    civil_twilight_begin?: string
    civil_twilight_end?: string
    nautical_twilight_begin?: string
    nautical_twilight_end?: string
    astronomical_twilight_begin?: string
    astronomical_twilight_end?: string
  }
}

export async function getSunTimes(
  latitude: number,
  longitude: number,
  date: Date,
): Promise<SunTimes> {
  const formattedDate = date.toISOString().split('T')[0] // Format date as 'YYYY-MM-DD'
  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${formattedDate}&formatted=0`

  try {
    const response = await fetch(url)
    const data = await response.json()

    assertApiResponseShape(data)

    if (response.ok && data.status === 'OK') {
      return {
        sunrise: data.results.sunrise,
        sunset: data.results.sunset,
        solarNoon: data.results.solar_noon,
      }
    }

    throw new Error(
      `Failed to fetch sun times (HTTP status code: ${response.status})`,
    )
  } catch (error) {
    logger.error('Error fetching sun times:', error)
    throw error
  }
}

function assertApiResponseShape(
  data: any,
): asserts data is SunTimesApiResponse {
  if (!data || typeof data !== 'object' || !data.results || !data.status) {
    throw new Error(
      'Invalid API response: Response is not an object or missing required fields',
    )
  }

  const {results, status} = data

  if (typeof status !== 'string' || status !== 'OK') {
    throw new Error('Invalid API response: Status field is missing or not OK')
  }

  if (
    typeof results !== 'object' ||
    !results.sunrise ||
    !results.sunset ||
    !results.solar_noon
  ) {
    throw new Error(
      'Invalid API response: Results object is missing required fields',
    )
  }

  if (typeof results.sunrise !== 'string') {
    throw new Error(
      'Invalid API response: Sunrise field is missing or not a string',
    )
  }

  if (typeof results.sunset !== 'string') {
    throw new Error(
      'Invalid API response: Sunset field is missing or not a string',
    )
  }

  if (typeof results.solar_noon !== 'string') {
    throw new Error(
      'Invalid API response: Solar noon field is missing or not a string',
    )
  }
}
