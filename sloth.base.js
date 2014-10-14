function Sloth($element, options) {
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
  this.ratio = 16 / 9;
  this.initialWidth = 0;
  this.initialHeight = 0;
  this.width = 0;

  this.init().bind();
}

window.Sloth = Sloth;

/**
 * Init everything
 * @return {Sloth} Instance for chainability
 */
Sloth.prototype.init = function () {
  var self = this;

  this.parseOptions();
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
    // Element has specified width
    this.initialWidth = width;
    this.width = (this.$element.get(0).style.width !== '') ? this.$element.get(0).style.width : this.initialWidth;
  } else {
    // Inherit width
    this.initialWidth = parseInt(this.$element.parent().css('width'));
    this.width = this.initialWidth;

    // When having a max-width specified, the image doesn't need a set width
    if (this.$element.css('max-width') !== 'none') {
      this.width = '';
    }
  }

  this.initialHeight = this.initialWidth * (1 / this.ratio);
};

Sloth.prototype.preload = function (callback) {
  var $img = $('<img />');

  $img.hide().appendTo(this.$preloader)
      .on('load', function () {
        callback($img)
      })
      .attr('src', this.source);
};

Sloth.prototype.parseSource = function () {
  this.source = this.$element.attr('data-src');
};

Sloth.prototype.parseOptions = function () {
  if (!!this.$element.attr('data-ratio')) {
    var ratio = this.$element.attr('data-ratio').split(':'),
        width = parseInt(ratio[0], 10),
        height = (!!ratio[1]) ? parseInt(ratio[1], 10) : 1;

    this.ratio = width / height;
  }
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

Sloth.load = function (selector) {
  $(selector).each(function () {
    if ($(this)[0].tagName.toLowerCase() === 'img') {
      new InlineSloth($(this));
    } else {
      new BackgroundSloth($(this));
    }
  });
}
