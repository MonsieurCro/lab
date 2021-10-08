console.clear();

try {
  if (!window.jQuery) {
    console.log('jQuery isn\'t loaded, trying to inject it.');
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    const jQueryIsLoaded = setInterval( function() {
      if (window.jQuery) { clearInterval(jQueryIsLoaded); window.ripper(); }
    }, 50);

  } else {
    console.log('jQuery already loaded, version', jQuery().jquery);
    window.ripper();
  }
} catch(e) { console.error('jQuery couldn\'t be injected:', e); }

/**/
function logger(message, type) {
  let style = [
    'color:white;',
    'padding:.5em;',
    'border-radius:.125em;'
  ].join('');
  const error = 'background-color:#E84393;';
  const info = 'background-color:#0984E3;';
  const success = 'background-color:#00B894;';
  const fail = 'background-color:#D63031;';
  const action = 'background-color:#6C5CE7;';

  switch(type) {
    case 'error': style += error; break;
    case 'info': style += info; break;
    case 'success': style += success; break;
    case 'fail': style += fail; break;
    case 'action': style += action; break;
    default: break;
  };
  console.log('%c' + message, style);
};

/**/
async function ripper() {
  logger('Fetching started.', 'action');

  const scrollDelay = 3000;
  const minSize = 150;
  const itemsList = [];

  try {
    logger(await scrollToBottom(scrollDelay), 'info');
    logger(await retrieveItems(minSize), 'info');
    //console.log(JSON.stringify(itemsList));
    saveToJson(itemsList);
  } catch(e) { console.error('Fetching failed:', e); };


  /**/
  async function scrollToBottom(delay) {
    return await new Promise(resolve => {
      let docHeight = jQuery(document).height();

      const myInterval = setInterval( function() {
        jQuery('html, body').animate({ scrollTop: docHeight }, 100, 'linear');

        setTimeout( function() {
          if (jQuery(document).height() === docHeight) {
            clearInterval(myInterval);
            resolve('Page fully loaded.');
          } else {
            docHeight = jQuery(document).height();
          };
        }, delay / 2);
      }, delay);
    });
  };

  /**/
  async function retrieveItems(size) {
    async function retrieveImgs(imgs) {
      if (!imgs || imgs.length < 1) return 'No images to retrieve.';

      for (let index = 0; index < imgs.length; index++) {
        try {
          let src = jQuery(imgs[index]).data('src') ? jQuery(imgs[index]).data('src') : jQuery(imgs[index]).attr('src'); //lazyLoad

          const checked = await new Promise(resolve => {
            if (itemsList.indexOf(src) === -1) { //isNew
              jQuery('<img>').attr('src', src).on('load', function() { //getSize
                if(this.width >= size && this.height >= size) { itemsList.push(src); }; //isBigEnough
                resolve(index);
              });
            } else { resolve(index); };
          });

          if (checked === imgs.length - 1) { return imgs.length + ' images reviewed.'; };

        } catch(e) { console.error('Image couldn\'t be retrieved:', e); };
      };
    };

    async function retrieveVideos(videos) {
      if (!videos || videos.length < 1) return 'No videos to retrieve.';

      for (let index = 0; index < videos.length; index++) {
        try {
          itemsList.push(jQuery(videos[index]).attr('src'));
          if (index === videos.length - 1) { return videos.length + ' videos reviewed.'; };

        } catch(e) { console.error('Video couldn\'t be retrieved:', e); };
      };
    };

    logger(await retrieveImgs(jQuery('img')), 'action');
    logger(await retrieveVideos(jQuery('video')), 'action');
    return itemsList.length + ' items retrieved.';
  };

  /**/
  function saveToJson(data) {
    if (!data || data.length < 1) { return logger('No data to download.', 'error'); }
    else { logger('Downloading ' + data.length + ' items as JSON.', 'success');

      try {
        let filename = (window.location.hostname + window.location.pathname).replace(/\//g, '_') || 'rip';
        filename = filename.length > 50 ? filename.substr(0, 50) : filename;

        if (typeof data === 'object') { data = JSON.stringify(data, undefined, 4); };

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename + '.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      } catch(e) { console.error('JSON couldn\'t be downloaded:', e); };
    };
  };
};