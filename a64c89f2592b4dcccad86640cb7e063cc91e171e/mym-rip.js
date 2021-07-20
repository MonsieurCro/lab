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
  if (!(window.location.origin.indexOf('mym.fans') > -1)) {
    console.error('-- Wrong website --');
  }
  else if (window.location.pathname.indexOf('app/feed') > -1) {
    console.error('-- Wrong page --');
  }
  else {
    var user = window.location.pathname.replace('/', '');
    var list = [];

    console.log('-- Fetching', user, '--');
    scrollToBottom(5000);
  };

  function scrollToBottom(interval) {
    let items = 0;

    const myInterval = setInterval( function() {
      $('html, body').animate({ scrollTop: $(document).height() }, 100);

      if (items === $('.medias-grid__item').length) {
        clearInterval(myInterval);
        console.log('-- Portfolio fully loaded (' + $('.medias-grid__item').length + '). --');
        retrieveSrc(list);
      } else {
        items = $('.medias-grid__item').length;
      };
    }, interval);
  };

  function retrieveSrc(array) {
    let avatar = $('.avatar__photo').children('img').attr('src');
    let cover = $('.profile__background__img').attr('src');
    array.push(avatar, cover);

    $('.medias-grid__item').each( function(i) {
      if (!($(this).children().first().hasClass('media--locked')) && $(this).find('img').length) {
        let src = $(this).find('img').attr('src');
        //console.log(i + ': ' + src);
        array.push(src);

        if ($(this).children().first().hasClass('media--video')) {
          console.log($(this).children().first());
        };
      };
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