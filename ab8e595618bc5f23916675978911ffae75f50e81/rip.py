#!/usr/bin/env python3

import json
import os
import requests
from tqdm import tqdm
import shutil

def fetch(urls, directory, logs):
  os.makedirs('./' + directory, exist_ok = True)
  headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  }
  count = 0

  for idx, url in enumerate(urls):
    index = '[' + str(idx + 1) + ']'
    filename = str(url.split('/')[-1].split('?')[0])
    shortname = filename if len(filename) <= 12 else filename[:11] + '…'

    try:
      r = requests.get(url, headers = headers, stream = True, allow_redirects = True)

      if int(r.status_code) == 200:
        r.raw.decode_content = True

        if logs == True:
          size = int(r.headers.get('content-length', 0))
          with open('./' + directory + '/' + filename[:245], 'wb') as temp, tqdm (
            desc = index + ' ' + shortname,
            total = size,
            unit = 'iB',
            unit_scale = True,
            unit_divisor = 1024,
            colour = 'magenta',
            bar_format = '{desc} {bar} {n_fmt}/{total_fmt} ({percentage:3.0f}%)'
          ) as bar:
            for data in r.iter_content(chunk_size = 1024):
              size = temp.write(data)
              bar.update(size)
        else:
          temp = open('./' + directory + '/' + filename[:245], 'wb')

        shutil.copyfileobj(r.raw, temp)
        #print(index, shortname, 'successfully downloaded.')
        count += 1

      else:
        print(index, shortname, 'couldn\'t be retrieved (Error ' + str(r.status_code) + ').')

    except Exception as e:
      print(index, 'Exception:', e)

  print('--- Fetching complete. Retrieved', count, 'elements.\n')
  init()

def init():
  file = input('\033[95m {}\033[00m'.format('Please enter path or \'help/folder/exit\': ')).replace(' ', '')
  if file == 'exit':
    exit('--- Goodbye! ---')
  elif file == 'folder':
    print('Folder:', os.getcwd())
    init()
  elif file == 'help' or file == '':
    print('--- This script accept the absolute (C:\ /Users/) or relative (./) path of a JSON file. ---')
    init()
  else:
    try:
      list = json.loads(open(file, 'r').read())
      folder = os.path.splitext(os.path.basename(file))[0]
      #print(json.dumps(list, indent = 2, sort_keys = True))

      print('\n--- Fetching', folder, '(' + str(len(list)) + ' entries)')
      fetch(list, folder, True)
    except Exception as e:
      print(e)
      init()

os.system('cls' if os.name == 'nt' else 'clear')
init()