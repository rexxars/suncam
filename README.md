# suncam

Daemon that finds the sunrise, sunset and solar noon times for a given location (defined by environment variables) and automatically takes photos at those times, by downloading a configured photo URL and uploading it to a Google Cloud Storage bucket.

It was mainly for fun and as an experiment to see how far ChatGPT could take things. Most of the code in `src` is written by ChatGPT, with a few modifications to suit my own preferences.

## Configuration

There are a few optional environment variables to configure:

- `LATITUDE` - Latitude of the location to find sunrise, sunset and solar noon times for. Defaults to 37.8715 (Berkeley).
- `LONGITUDE` - Longitude of the location to find sunrise, sunset and solar noon times for. Defaults to -122.273 (Berkeley).
- `PHOTO_URL` - URL to download the photo from. Will throw if not set.
- `SECOND_OFFSET` - Number of seconds to offset the sunrise and sunset times by. Defaults to 0.
- `GCS_BUCKET` - Google Cloud Storage bucket to upload the photos to.
- `GCS_PROJECT_ID` - Google Cloud project ID to use.
- `GCS_KEY_FILE_PATH` - Path to the Google Cloud service account keyfile to use.
- `LOG_LEVEL` - Pino log level. Defaults to `info`. Must be one of `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`.

## Attribution

Sunrise, sunset and solar noon times are provided by querying the [Sunrise Sunset API](https://sunrise-sunset.org/api).

## License

MIT © Espen Hovlandsdal
