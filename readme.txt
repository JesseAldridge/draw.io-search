
Install dependencies:
`npm install`

Convert the diagrams from base64 to plaintext:
`node drawio_convert.js path/to/diagrams/`

There should now be a directory called path/to/diagrams/inflated containing greppable versions of
your documents.

Included are two shortcut scripts which you can put on your `PATH` if you want (i.e. copy them to
`/usr/local/bin` or something like that). If you want to use them you'll need to modify them to use
the appropriate paths for your computer.

dgi is short for "diagram inflate"
It simply runs the main script.

dgs is short for "diagram search"
This will search the decoded files using `ag` (`brew install the_silver_searcher`)
