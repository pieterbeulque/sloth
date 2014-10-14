# Lazy

Lazy is a lazy image loading solution that works on both inline images and as background images, on any viewport, on any device.

*Crafted with love by [@pieterbeulque](//github.com/pieterbeulque) & [@icidasset](//github.com/icidasset) at [@mrhenry](github.com/mrhenry)*

## Options

Options can be set globally on the `Sloth` object.

```js
Sloth.settings = {
  versions: {
    220: 'small',
    640: 'medium',
    1280: 'large'
  },
  retina: '',
  ratio: 16 / 9
};
```

Versions keys are min-widths with the data attribute suffix as value: `220: 'small'` will look for `data-src-small` if the elements width is between 220 and 640 pixels. If `data-src-{{size}}` is not found, it falls back to `data-src`.

Retina is the suffix to append on high pixel density screens. It checks for `devicePixelRatio` and will add the suffix to the source if bigger than one.

Ratio is the default ratio to use on inline images when loading. You can set this per image with a `data-ratio="4:3"` attribute, but this is the fallback.