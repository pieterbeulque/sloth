function BackgroundSloth($element, options) {
  Sloth.call(this, $element, options);
}

window.BackgroundSloth = BackgroundSloth;

BackgroundSloth.prototype = new Sloth();

BackgroundSloth.prototype.constructor = Sloth;

BackgroundSloth.prototype.wrap = function () {
  var $background = $('<div class="sloth__background" />');

  this.$element.addClass('sloth is-loading');

  // Make sure position:absolute on children is relative to the current element
  if (this.$element.css('position') === 'static') {
    this.$element.css('position', 'relative');
  }

  if (this.$element.html().length > 0) {
    // Wrap content
    this.$element.wrapInner(
      $('<div class="sloth__content" />').css({
        'position': 'relative',
        'z-index': 2
      })
    );
  }

  // Stretch background, inherit background properties from element
  $background.css({
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'bottom': 0,
    'z-index': 1,
    'background': this.$element.css('background')
  }).hide().appendTo(this.$element);
};

BackgroundSloth.prototype.onLoad = function ($img) {
  var $element = this.$element;

  $element.find('.sloth__background').css('background-image', 'url(' + $img.attr('src') + ')').fadeIn(880, function () {
    $element.removeClass('is-loading');
  });
};