# coding: utf-8
# #!/usr/bin/env python3

try:
  import logging
  import json
  import os
  import requests
  from tqdm import tqdm
  import shutil
except ImportError as e:
  logging.error(e)
  print('\033[91m {}\033[00m'.format('Error:'), 'Run \'pip3 install --upgrade --user -r ./req/modules.txt\' and try again.\n')
  exit(0)

def fetch(urls, directory, logs):
  os.makedirs('./rips/' + directory, exist_ok = True)
  count = 0

  s = requests.Session()
  request = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
    'accept': 'application/json, text/plain, */*',
    'Referer': '',
    'Cookie' : ''
  }
  #s.post(url, data = {}, headers = request, stream = True, allow_redirects = True)

  for idx, url in enumerate(urls):
    index = '[' + str(idx + 1) + ']'
    filename = str(url.split('/')[-1].split('?')[0])
    shortname = filename if len(filename) <= 12 else filename[:11] + '…'
    url = url if url.find('http://') > -1 or url.find('https://') > -1 else 'https://' + url

    try:
      r = s.get(url, headers = request, stream = True, allow_redirects = True)

      if int(r.status_code) == 200:
        r.raw.decode_content = True
        root, ext = os.path.splitext(filename)
        type = '.' + r.headers.get('content-type', '').split('/')[-1] if not ext and r.headers.get('content-type', '') else ''
        path = './rips/' + directory + '/' + str(len(urls) - idx) + '_' + filename[:245] + type

        if logs == True:
          size = int(r.headers.get('content-length', 0))
          with open(path, 'wb') as temp, tqdm (
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
          temp = open(path, 'wb')

        shutil.copyfileobj(r.raw, temp)
        #print(index, 'Successfully downloaded.')
        count += 1

      else:
        print('\033[91m {}\033[00m'.format(index, 'Error:'), r.status_code)

    except KeyboardInterrupt:
      print('↳ Task cancelled by user. Retrieved ' + str(count) + ' elements out of ' + str(len(urls)) + '.\n')
      init()
    except Exception as e:
      print('\033[91m {}\033[00m'.format(index, 'Exception:'), e)
      pass

  print('↳ Fetching complete. Retrieved ' + str(count) + ' elements out of ' + str(len(urls)) + '.\n')
  s.close()
  init()

def init():
  file = input('\033[95m {}\033[00m'.format('Please enter the file path or \'help/dir/exit\':\t')).replace(' ', '')
  if file == 'exit':
    exit('↳ Goodbye!\n')
  elif file == 'dir':
    print('↳ Directory:', os.getcwd() + '/rips/', '\n')
    init()
  elif file == 'help' or file == '':
    print('↳ This script accept the absolute (C:\ /Users/) or relative (./) path of a JSON file.\n')
    init()
  else:
    try:
      list = json.loads(open(file, 'r').read())
      name = os.path.splitext(os.path.basename(file))[0]
      #print(json.dumps(list, indent = 2, sort_keys = True))

      print('↳ Fetching ' + str(len(list)) + ' entries from \'' + name + '\'.')
      fetch(list, name, True)
    except Exception as e:
      logging.error(e)
      print('\033[91m {}\033[00m'.format('Error:'), e, '\n')
      pass
      init()
      #exit(0)

os.system('cls' if os.name == 'nt' else 'clear')
init()