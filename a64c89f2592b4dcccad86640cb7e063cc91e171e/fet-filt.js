try {
  if (!window.jQuery) {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    const jQueryIsLoaded = setInterval( function() {
      if (window.jQuery) { clearInterval(jQueryIsLoaded); window.filter(); }
    }, 50);
  } else { window.filter(); }
} catch(e) { console.error('jQuery is not present, and couldn\'t load:', e); }

/**/

function filter() {
  console.clear();
  if (!(window.location.origin.indexOf('fetlife.com') > -1)) {
    return console.error('-- Wrong website --');
  }
  /*else if (!(window.location.pathname.indexOf('/users/') > -1)) {
    return console.error('-- Wrong page --');
  };*/

  $('.w-100.br1').each( function(i) {
    if ($(this).find('.f6.fw7').length) {
      try {
        let info = $(this).find('.f6.fw7').text().split(' ')[0];
        let gender = info.replace(/\d+/g, '');
        let age = parseInt(info);
        let gallery = parseInt($(this).find('.dot-separated').text());

        if (gender === 'M' || age >= 40) { $(this).parents('.w-50-ns.w-100').hide(); }
        else if (gender === 'F' && gallery > 1) { $(this).css({'border':'.125em solid red'}); }
      } catch(e) { console.log(e); }
    };
  });
};