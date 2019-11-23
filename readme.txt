
Install dependencies:
```
sudo npm install -g glob expand-home-dir
npm install
brew install the_silver_searcher

# copy scripts onto path
cp dgs ~/Dropbox/bin
cp search_diagrams.js ~/Dropbox/bin
```

Run the inflater loop in the background:
`python background_inflater.py 2>&1 | tee ~/drawio_decode.log`

background_inflater.py runs drawio_convert.js
drawio_convert.js reads all the drawio files in the path you specify, inflates the base64 encoding, and rewrites them in plaintext to another path you specify

dgs is short for "diagram search"
This will search the decoded files using `ag`
