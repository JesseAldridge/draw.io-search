
Install dependencies:
```
sudo npm install -g glob expand-home-dir cheerio
brew install the_silver_searcher

# put scripts on path (this is how I do it)
ln /Users/jessealdridge/Dropbox/drawio_decode/dgs /Users/jessealdridge/Dropbox/bin/dgs
ln /Users/jessealdridge/Dropbox/drawio_decode/search_diagrams /Users/jessealdridge/Dropbox/bin/search_diagrams
```

Run the inflater loop in the background:
`python background_inflater.py 2>&1 | tee ~/drawio_decode.log`

background_inflater.py runs drawio_convert.js
drawio_convert.js reads all the drawio files in the path you specify, inflates the base64 encoding, and rewrites them in plaintext to another path you specify

dgs is short for "diagram search"
This will search the decoded files using `ag`
