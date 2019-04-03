import subprocess, time, os
from datetime import datetime

while True:
  script_path = os.path.expanduser('~/Dropbox/drawio_decode/drawio_convert.js')
  subprocess.Popen(['node', script_path, '~/Dropbox/diagrams']).communicate()
  time.sleep(60 * 60)
