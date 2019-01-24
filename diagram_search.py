#!/usr/local/bin/python
import subprocess, os, glob, sys

def main(query, dir_path):
  prev_wd = os.getcwd()
  dir_path = os.path.expanduser(dir_path)
  os.chdir(dir_path)
  try:
    print("searching for", query)
    search_diagrams(query, dir_path)
  finally:
    os.chdir(prev_wd)

def search_diagrams(query, dir_path):
  cmd_arr = ['ag', '--ignore-case', '--files-with-matches', "{}".format(query)]
  proc = subprocess.Popen(cmd_arr, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
  out_str = proc.communicate()[0].decode('utf8')
  out_lines = out_str.splitlines()
  paths = [line for line in out_lines if line.endswith('.xml')]
  for path in paths:
    search_path(path, query)
    print()

  print("filename matches:")
  search_filenames(query, dir_path)

def search_filenames(query, dir_path):
  glob_path = os.path.join(dir_path, '**/*.xml')
  for path in glob.glob(glob_path, recursive=True):
    if query in path:
      print(path.split(dir_path)[1])

def search_path(path, query):
# -*- coding: utf-8 -*-

  GREEN = '\033[92m'
  COLOR_END = '\033[0m'

  print('{}{}{}'.format(GREEN, path, COLOR_END))
  print('===')
  cmd_arr = ['ag', '--ignore-case', '--context=1', "{}".format(query), path]
  proc = subprocess.Popen(cmd_arr)
  proc.communicate()

  with open(path) as f:
    text = f.read()
  print('line count:', len(text.splitlines()))

if __name__ == '__main__':
  main('artist', '~/Dropbox/diagrams/inflated')
  # main(' '.join(sys.argv[1:]), '~/Dropbox/diagrams/inflated')
