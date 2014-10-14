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
  if (this.$element.css('position') === 'static' || this.$element.css('position') === 'relative') {
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
function InlineSloth($element, options) {
  Sloth.call(this, $element, options);
}

window.InlineSloth = InlineSloth;

InlineSloth.prototype = new Sloth();

InlineSloth.prototype.constructor = Sloth;

InlineSloth.prototype.calculateDimensions = function () {
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

InlineSloth.prototype.wrap = function () {
  var $wrapper = $('<span class="sloth is-loading" />');

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

  this.$element.hide().attr('src', $img.attr('src')).fadeIn(880, function () {
    $wrapper.removeClass('is-loading');
  });

  // Compensate the difference between the assumed ratio and the actual image height
  $wrapper.animate({ 'height': this.initialWidth / $img.width() * $img.height() }, 220, function () {
    $wrapper.css('height', '');
  });
};
