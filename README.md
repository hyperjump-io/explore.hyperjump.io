# Hyperjump - Explorer

[https://explore.hyperjump.io][explore]

Hyperjump Explorer is a web interface for the [Hyperjump Browser]. It allows you
to visually explore a graph of data by following links embedded in the data.

For now, the Explorer only works with the JSON Reference ([JRef]) media type.
However, the [Hyperjump Browser] can work with other media types, so I'd like to
be able to support other media types (such as [JSON Schema]) in the in the
future.

## Deployment

The app is deployed to Github Pages from the `gh-pages` branch. The site is
served through Cloudflare. TODO: Automate deployment

[explore]: https://explore.hyperjump.io/#https://swapi.hyperjump.io/api/films/1
[Hyperjump Browser]: https://github.com/hyperjump-io/browser
[JRef]: https://github.com/hyperjump-io/browser/tree/main/lib/jref/SPECIFICATION.md
