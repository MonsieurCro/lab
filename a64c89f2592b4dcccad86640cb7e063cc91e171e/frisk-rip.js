try {
  if (!window.jQuery) {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    const jQueryIsLoaded = setInterval( function() {
      if (window.jQuery) { clearInterval(jQueryIsLoaded); window.ripper(); }
    }, 50);
  } else { window.ripper(); }
} catch(e) { console.error('jQuery is not present, and couldn\'t load:', e); }

/**/

function ripper() {
  console.clear();
  if (!(window.location.origin.indexOf('frisk.chat') > -1)) {
    console.error('-- Wrong website --');
  }
  else if (window.location.pathname.indexOf('/feed') > -1) {
    console.error('-- Wrong page --');
  }
  else {
    var user = window.location.pathname.replace('/', '');
    var list = [];

    console.log('-- Fetching', user, '--');
    scrollToBottom(2500);
  };

  function scrollToBottom(interval) {
    let items = 0;

    const myInterval = setInterval( function() {
      jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 100);

      if (items === jQuery('.post.media').length) {
        clearInterval(myInterval);
        console.log('-- Portfolio fully loaded (' + jQuery('.post.media').length + '). --');
        retrieveSrc(list);
      } else {
        items = jQuery('.post.media').length;
      };
    }, interval);
  };

  function retrieveSrc(array) {
    let avatar = jQuery('.avatar').children('img').attr('src');
    let cover = jQuery('.cover').css('background-image').replace('url("', '').replace('")', '');
    array.push(avatar, cover);

    jQuery('.gallery').each( function(i) {
      if (jQuery(this).children('.video') && jQuery(this).find('video').attr('src')) {
        array.push(jQuery(this).children('.video').find('img.single').attr('src'));
        array.push(jQuery(this).children('.video').find('video').attr('src'));
      }
      else if (jQuery(this).children('.single') && jQuery(this).children('.single').attr('href')) {
        array.push(jQuery(this).children('.single').attr('href'));
      }
      else if (jQuery(this).children('.masonry') && jQuery(this).children('.masonry').children('figure').length > -1) {
        jQuery(this).children('.masonry').children('figure').each( function(i) {
          array.push(jQuery(this).children('div').attr('href'));
        });
      }
    });
    console.log('-- URLs list fetched (' + (array.length - 2) + '). --');

    //save to json
    try {
      saveToJson(array, user + '.json');
      console.log('-- Downloading as JSON. --');
    } catch (e) {
      console.error('-- Export failed:', e);
    };
  };

  function saveToJson(data, filename) {
      if (!data) { console.error('No data'); return; };
      if (!filename) { filename = 'file.json'; };
      if (typeof data === 'object') { data = JSON.stringify(data, undefined, 4); };

      var blob = new Blob([data], {type: 'text/json'}),
          e    = document.createEvent('MouseEvents'),
          a    = document.createElement('a')

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
  };
};