function BackgroundSloth($element, options) {
  Sloth.call(this, $element, options);
}

BackgroundSloth.prototype = new Sloth();

BackgroundSloth.prototype.constructor = Sloth;

BackgroundSloth.prototype.wrap = function () {
  var $wrapper = $('<div class="sloth__content" />'),
      $background = $('<div class="sloth__background" />');

  if (this.$element.css('position')) {
    this.$element.css('position', 'relative');
  }

  // Stretch wrapper, according to padding etc
  $wrapper.css({
    'position': 'relative',
    'z-index': 2
  });

  // Stretch background, inherit background properties from element
  $background.css({
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'bottom': 0,
    'z-index': 1,
    'background': this.$element.css('background')
  }).hide();

  this.$element.addClass('sloth is-loading')
               .wrapInner($wrapper)
               .append($background);
}

BackgroundSloth.prototype.onLoad = function ($img) {
  this.$element.removeClass('is-loading');
  this.$element.find('.sloth__background').css('background-image', 'url(' + $img.attr('src') + ')').fadeIn(440);
};