# Hyperjump Explorer

[https://explore.hyperjump.io][explore]

Hyperjump Explorer is a web interface for the [Hyperjump][hyperjump] browser. It
allows you to visually explore a graph of data by following links embedded in
the data.

The Explorer only works with the [JSON Reference][jref] (JRef) media type. The
Hyperjump browser can work with other media types, so I'd like to be able to
support other media types in the Explorer in the future.

## Deployment

The app is deployed to Github Pages from the `gh-pages` branch. The site is
served through Cloudflare. TODO: Automate deployment

[explore]: https://explore.hyperjump.io/#https://swapi.hyperjump.io/api/films/1
[hyperjump]: https://github.com/hyperjump-io/browser
[jref]: https://github.com/hyperjump-io/browser/blob/master/lib/json-reference/README.md
