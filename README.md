# Make Stops API

Create a palette of colors based on a single "base" color.
## API
  ``` jsonc
  {
    "base": "#00ffb7",    // base color - required
    "count": 10,          // stop count
    "l": {                // luminosity options
      "max": 75,          // max lum
      "min": 25           // min lum
    },
    "s": {                // saturation options
      "add": 0,           // sat to add
      "sub": 0            // sat to subtract
    },
    "h": {                // hue options
      "add": 0,           // hue to add
      "sub": 0            // hue to subtract
    }
  }
```

<details>
  <summary>Details</summary>

  ### `base: string` *(required)*
  Base color for the theme as a hexadecimal color code.

  ### `count: number`
  The number of luminosity stops in the returned palette.

  *Default is `10`*

  ### `l.max: number`
  **Absolute:** The maximum (lightest) luminosity for the returned color palette.

  *Default is `75`*

  ### `l.min: number`
  **Absolute:** The minimum (darkest) luminosity for the returned color palette.

  *Default is `25`*

  ### `s.add: number`
  **Relative:** The amount of saturation to add/remove at the lightest returned color (applied linearly from the base color).

  *Default is `0`*

  ### `s.sub: number`
  **Relative:** The amount of saturation to add/remove at the darkest returned color (applied linearly from the base color).

  *Default is `0`*

  ### `h.add: number`
  **Relative:** Count of hue degrees to add/remove at the lightest returned color (applied linearly from the base color).

  *Default is `0`*

  ### `h.sub: number`
  **Relative:** Count of hue degrees to add/remove at the darkest returned color (applied linearly from the base color).

  *Default is `0`*
</details>
