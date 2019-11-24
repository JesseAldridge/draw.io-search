import subprocess, time, os
from datetime import datetime

while True:
  script_path = os.path.expanduser('~/Dropbox/drawio_search/inflate_all.js')
  subprocess.Popen(['node', script_path, '~/Dropbox/diagrams']).communicate()
  time.sleep(60 * 60)
