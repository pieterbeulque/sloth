function InlineSloth($element, options) {
  Sloth.call(this, $element, options);
}

InlineSloth.prototype = new Sloth();

InlineSloth.prototype.constructor = Sloth;

InlineSloth.prototype.wrap = function () {
  var $wrapper = $('<span class="sloth is-loading" />');

  // Calculate reserved width and height
  this.reserveSpace();

  // Take in the reserved space in the DOM
  $wrapper.css({
    'width': this.initialWidth,
    'height': this.initialHeight,
    'display': 'inline-block',
    'max-width': this.$element.css('max-width'),
    'font-size': 0
  });

  // Since the wrapper took over the positioning of the image,
  // make the image fill the wrapper
  this.$element.css({
    'display': 'block',
    'width': '100%',
    'position': 'relative',
    'z-index': 2
  });

  this.$element.wrap($wrapper);
}

InlineSloth.prototype.onLoad = function ($img) {
  var $wrapper = this.$element.closest('.sloth');

  // Set width to the actual CSS property or inherited width instead of fixed placeholder
  $wrapper.css('width', this.width);

  this.$element.hide().attr('src', $img.attr('src')).fadeIn(440, function () {
    $wrapper.removeClass('is-loading');
  });

  // Compensate the difference between the assumed ratio and the actual image height
  $wrapper.animate({ 'height': this.initialWidth / $img.width() * $img.height() }, 440, function () {
    $wrapper.css('height', '');
  });
};
