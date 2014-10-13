(function () { 'use strict';  function Sloth($element, options) {
  options = options || {};

  /**
   * Parent for all animated elements
   * @type {Object} Must be jQuery object
   */
  this.$element   = $element || $('[data-src]').first();
  this.$preloader = options.$preloader || $(document.body);

  this.isInline = this.$element[0].tagName.toLowerCase() === 'img';

  this.source = this.$element.attr('data-src');

  this.isWidthInherited = false;
  this.initialWidth = 0;
  this.initialHeight = 0;
  this.width = 0;

  this.init().bind();
}

/**
 * Init everything
 * @return {Sloth} Instance for chainability
 */
Sloth.prototype.init = function () {
  var self = this;

  // this.parseOptions();
  this.parseSource();

  this.wrap();

  this.preload($.proxy(this.onLoad, this));

  return this;
};

Sloth.prototype.wrap = function () {};

Sloth.prototype.onLoad = function () {};

Sloth.prototype.reserveSpace = function () {
  var $parent = this.$element.parent(),
      width = parseInt(this.$element.css('width'), 10);

  if (!!width) {
    this.initialWidth = width;
    this.width = (this.$element.get(0).style.width !== '') ? this.$element.get(0).style.width : this.initialWidth;
  } else {
    this.initialWidth = parseInt(this.$element.parent().css('width'));
    this.width = this.initialWidth;

    if (this.$element.css('max-width') !== 'none') {
      this.width = '';
    }
  }

  this.initialHeight = this.initialWidth * 9 / 16;

  this.$element.css('width', '100%');
};

Sloth.prototype.preload = function (callback) {
  var $img = $('<img />');
  console.log('Start preloading image');
  $img.hide().appendTo(this.$preloader)
      .on('load', function () {
        callback($img)
      })
      .attr('src', this.source);
};

Sloth.prototype.parseSource = function () {
  this.source = this.$element.attr('data-src');
};

Sloth.prototype.bind = function () {
  return this;
};

Sloth.prototype.reset = function () {
  return this;
};

Sloth.prototype.unbind = function () {
  return this;
};

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
function InlineSloth($element, options) {
  Sloth.call(this, $element, options);
}

InlineSloth.prototype = new Sloth();

InlineSloth.prototype.constructor = Sloth;

InlineSloth.prototype.wrap = function () {
  var $wrapper = $('<span class="sloth is-loading" />');

  // Calculate reserved width and height
  this.reserveSpace();

  $wrapper.css({
    'width': this.initialWidth,
    'height': this.initialHeight,
    'display': 'inline-block',
    'max-width': this.$element.css('max-width'),
    'font-size': 0
  });

  this.$element.css('display', 'block');
  this.$element.wrap($wrapper);
}

InlineSloth.prototype.onLoad = function ($img) {
  var $wrapper = this.$element.closest('.sloth');

  $wrapper.removeClass('is-loading');
  $wrapper.css('width', this.width);
  this.$element.hide().attr('src', $img.attr('src')).fadeIn(440);
  $wrapper.animate({ 'height': this.initialWidth / $img.width() * $img.height() }, 440, function () {
    $wrapper.css('height', '');
  });
};

exports.init = function ($element, options) {
  $('[data-src]').each(function () {
    if ($(this)[0].tagName.toLowerCase() === 'img') {
      new InlineSloth($(this));
    } else {
      new BackgroundSloth($(this));
    }
  });
};
 }())