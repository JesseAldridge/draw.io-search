import subprocess, time

while True:
  script_path = '/Users/Jesse/Dropbox/drawio_decode/drawio_convert.js'
  subprocess.Popen(['node', script_path, '~/Dropbox/diagrams']).communicate()
  time.sleep(60 * 60)
