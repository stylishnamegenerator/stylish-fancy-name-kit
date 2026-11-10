# fancy-name-kit

A tiny, dependency-free JavaScript library that turns plain text into Unicode "fancy font" styles and checks whether the result fits common game and app name limits.

**Live demo:** https://stylishnamegenerator.github.io/stylish-fancy-name-kit/

```
Hammad → 𝐇𝐚𝐦𝐦𝐚𝐝  𝐻𝑎𝑚𝑚𝑎𝑑  ℋ𝒶𝓂𝓂𝒶𝒹  ℍ𝕒𝕞𝕞𝕒𝕕  𝙷𝚊𝚖𝚖𝚊𝚍  Ⓗⓐⓜⓜⓐⓓ  Ｈａｍｍａｄ
```

## Why

"Fancy fonts" are not fonts. They are look-alike Unicode characters (mostly from the Mathematical Alphanumeric Symbols block). That has two practical effects:

- Many of these letters take **two UTF-16 code units**, so a 6-letter name can count as 12 characters in an app or game.
- Some letters live outside the main block (for example script `ℬ`, `ℰ`, `ℱ`), so a naive "add an offset" converter produces broken characters. This library handles those exceptions.

## Usage

Browser:

```html
<script src="fancy-name-kit.js"></script>
<script>
  FancyNameKit.convert('Ali', 'bold');            // "𝐀𝐥𝐢"
  FancyNameKit.convertAll('Ali');                 // [{ style: 'bold', text: '𝐀𝐥𝐢' }, ...]
  FancyNameKit.checkLimit('𝐇𝐚𝐦𝐦𝐚𝐝', 'freeFire');
  // { limit: 12, visible: 6, codeUnits: 12, fitsVisible: true, fitsStrict: true }
</script>
```

Node:

```js
const kit = require('./fancy-name-kit.js');
console.log(kit.convert('Hammad', 'script')); // ℋ𝒶𝓂𝓂𝒶𝒹
```

### Styles

`bold`, `italic`, `boldItalic`, `script`, `boldScript`, `fraktur`, `doubleStruck`, `sans`, `sansBold`, `monospace`, `circled`, `fullwidth`

### Limits included

| Key | Limit |
|---|---|
| `freeFire` | 12 |
| `pubgMobile` | 14 |
| `robloxDisplayName` | 20 |
| `whatsappName` | 25 |
| `instagramName` | 30 |
| `tiktokName` | 30 |
| `discordDisplayName` | 32 |
| `xDisplayName` | 50 |

Apps change their limits and count fancy letters in different ways, so treat these as a guide and always test the final name in the app.

## Accessibility note

Screen readers often read fancy letters badly or skip them. Keep important information, links and usernames you want people to search for in plain text.

## Tests

```
node test.js
```

## Credits

Made by [Stylish Name Generators](https://stylishnamegenerators.com/), a free stylish name generator with fancy fonts, symbols and frames for Free Fire, PUBG, Instagram and WhatsApp.

## License

MIT
