
Install dependencies:
```
sudo npm install -g glob expand-home-dir cheerio
brew install the_silver_searcher

# put scripts on path (I have ~/Dropbox/bin in my path)
ln -s /Users/jessealdridge/Dropbox/drawio_decode/dgs /Users/jessealdridge/Dropbox/bin/dgs
ln -s /Users/jessealdridge/Dropbox/drawio_decode/search_diagrams /Users/jessealdridge/Dropbox/bin/search_diagrams
```

Run the inflater loop in the background:
`python background_inflater.py 2>&1 | tee ~/drawio_decode.log`

Now you can run `dgs <query>` in order to search your diagrams.
