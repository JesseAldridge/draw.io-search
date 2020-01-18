
The script assumes your diagrams are stored at `~/Dropbox/diagrams`

```
# install dependencies
sudo npm install -g glob expand-home-dir cheerio

# put scripts on path (I have `export PATH=$PATH:~/Dropbox/bin` in my `.bash_profile`)
ln -s /Users/jessealdridge/Dropbox/drawio_search/dgs /Users/jessealdridge/Dropbox/bin/dgs
ln -s /Users/jessealdridge/Dropbox/drawio_search/search_diagrams /Users/jessealdridge/Dropbox/bin/search_diagrams
```

Run the inflater loop in the background:
`python background_inflater.py 2>&1 | tee ~/drawio_search.log`

Now you can run `dgs <query>` in order to search your diagrams.
