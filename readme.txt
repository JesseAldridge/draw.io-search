
Install dependencies:
`npm install`

Convert your diagrams from base64 to plaintext:
`node drawio_convert.js path/to/diagrams/`

There should now be a directory called path/to/diagrams/inflated containing greppable versions of
your documents.

`python3 diagram_search.py <foo>` will search your inflated diagrams for `foo`
