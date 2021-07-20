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
  if (!(window.location.origin.indexOf('fetlife.com') > -1)) {
    console.error('-- Wrong website --');
  }
  else if (!(window.location.pathname.indexOf('/users/') > -1)) {
    console.error('-- Wrong page --');
  }
  else {
    var id = window.location.pathname.split('/')[2];
    var user = $('.mr1.secondary').first().text();
    var list = [];

    console.log('-- Fetching ' + user + ' (' + id + ') --');
    scrollToBottom(2500);
  };

  function scrollToBottom(interval) {
    let items = 0;

    const myInterval = setInterval( function() {
      $('html, body').animate({ scrollTop: $(document).height() }, 100);

      if (items === $('.ph1.mt2').length) {
        clearInterval(myInterval);
        console.log('-- Gallery fully loaded (' + $('.ph1.mt2').length + '). --');
        retrieveSrc(list);
      } else {
        items = $('.ph1.mt2').length;
      };
    }, interval);
  };

  function retrieveSrc(array) {
    $('.ph1.mt2').each( function(i) {
      if ($(this).find('img').length) {
        let src = $(this).find('img').attr('src');
        array.push(src);
      };
    });
    console.log('-- URLs list fetched (' + array.length + '/' + $('.ph1.mt2').length + '). --');

    try {
      saveToJson(array, id + '_' + user + '.json');
      console.log('-- Downloading as JSON. --');
    } catch (e) {
      console.error('-- Export failed:', e);
    };
  };

  function saveToJson(data, filename) {
      if (!data) { console.error('No data'); return; };
      if (!filename) { filename = Date.now() + '.json'; };
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