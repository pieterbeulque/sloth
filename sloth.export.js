exports.init = function ($element, options) {
  $('[data-src]').each(function () {
    if ($(this)[0].tagName.toLowerCase() === 'img') {
      new InlineSloth($(this));
    } else {
      new BackgroundSloth($(this));
    }
  });
};
