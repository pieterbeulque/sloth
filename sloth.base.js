function Sloth($element) {
  if (typeof $element === 'undefined') {
    return;
  }

  Sloth.settings = Sloth.settings || {
    versions: {
      220: 'small',
      640: 'medium',
      1280: 'large'
    },
    retina: '',
    ratio: 16 / 9
  };

  /**
   * Parent for all animated elements
   * @type {Object} Must be jQuery object
   */
  this.$element = $element || $('[data-src]').first();

  this.isInline = this.$element[0].tagName.toLowerCase() === 'img';

  this.source = this.$element.attr('data-src');

  this.isWidthInherited = false;
  this.ratio = Sloth.settings.ratio;
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
  this.calculateDimensions();
  this.parseSource();
  this.wrap();
  this.preload($.proxy(this.onLoad, this));

  return this;
};

Sloth.prototype.wrap = function () {};

Sloth.prototype.onLoad = function () {};

Sloth.prototype.calculateDimensions = function () {
  this.initialWidth = parseInt(this.$element.css('width'), 10);
  this.width = (this.$element.get(0).style.width !== '') ? this.$element.get(0).style.width : this.initialWidth;
  this.initialHeight = this.initialWidth * (1 / this.ratio);
};

Sloth.prototype.preload = function (callback) {
  var $img = $('<img />');

  $img.hide().appendTo($(document.body))
      .on('load', function () {
        callback($img);
        $img.remove();
      })
      .attr('src', this.source);
};

Sloth.prototype.parseSource = function () {
  var pixelRatio = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio,
      modifier = '',
      neededWidth;

  pixelRatio = (typeof pixelRatio === 'undefined') ? 1 : parseFloat(pixelRatio);

  for (var size in Sloth.settings.versions) {
    if (Sloth.settings.versions.hasOwnProperty(size)) {
      var version = Sloth.settings.versions[size];

      if (this.initialWidth > parseInt(size, 10)) {
        modifier = version;
      } else {
        break;
      }
    }
  }

  if (!!this.$element.attr('data-src-' + modifier)) {
    this.source = this.$element.attr('data-src-' + modifier);
  } else {
    this.source = this.$element.attr('data-src');
  }

  if (pixelRatio > 1 && !!Sloth.settings.retina) {
    this.source += Sloth.settings.retina;
  }
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
};
