/*!
 * fancy-name-kit v1.0.0
 * Turn plain text into Unicode "fancy font" styles and check game/app name limits.
 * MIT License — made by Stylish Name Generators (https://stylishnamegenerators.com/)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FancyNameKit = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Each style maps A–Z, a–z (and 0–9 where Unicode has them) to a starting code point.
  // Some letters live outside the main block (e.g. script "B"), so exceptions are listed per style.
  var STYLES = {
    bold:          { upper: 0x1D400, lower: 0x1D41A, digit: 0x1D7CE },
    italic:        { upper: 0x1D434, lower: 0x1D44E, ex: { h: 0x210E } },
    boldItalic:    { upper: 0x1D468, lower: 0x1D482 },
    script:        { upper: 0x1D49C, lower: 0x1D4B6,
                     ex: { B: 0x212C, E: 0x2130, F: 0x2131, H: 0x210B, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211B,
                           e: 0x212F, g: 0x210A, o: 0x2134 } },
    boldScript:    { upper: 0x1D4D0, lower: 0x1D4EA },
    fraktur:       { upper: 0x1D504, lower: 0x1D51E,
                     ex: { C: 0x212D, H: 0x210C, I: 0x2111, R: 0x211C, Z: 0x2128 } },
    doubleStruck:  { upper: 0x1D538, lower: 0x1D552, digit: 0x1D7D8,
                     ex: { C: 0x2102, H: 0x210D, N: 0x2115, P: 0x2119, Q: 0x211A, R: 0x211D, Z: 0x2124 } },
    sans:          { upper: 0x1D5A0, lower: 0x1D5BA, digit: 0x1D7E2 },
    sansBold:      { upper: 0x1D5D4, lower: 0x1D5EE, digit: 0x1D7EC },
    monospace:     { upper: 0x1D670, lower: 0x1D68A, digit: 0x1D7F6 },
    circled:       { upper: 0x24B6,  lower: 0x24D0, ex: { '0': 0x24EA }, digitFrom1: 0x2460 },
    fullwidth:     { upper: 0xFF21,  lower: 0xFF41, digit: 0xFF10 }
  };

  function convertChar(ch, s) {
    if (s.ex && s.ex[ch] !== undefined) return String.fromCodePoint(s.ex[ch]);
    var c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) return String.fromCodePoint(s.upper + c - 65);
    if (c >= 97 && c <= 122) return String.fromCodePoint(s.lower + c - 97);
    if (c >= 48 && c <= 57) {
      if (s.digit) return String.fromCodePoint(s.digit + c - 48);
      if (s.digitFrom1 && c > 48) return String.fromCodePoint(s.digitFrom1 + c - 49);
    }
    return ch;
  }

  /** Convert text to one style. Characters a style does not cover are kept as they are. */
  function convert(text, style) {
    var s = STYLES[style];
    if (!s) throw new Error('Unknown style: ' + style);
    var out = '';
    for (var i = 0; i < text.length; i++) out += convertChar(text[i], s);
    return out;
  }

  /** Convert text to every style. Returns [{ style, text }]. */
  function convertAll(text) {
    return Object.keys(STYLES).map(function (k) { return { style: k, text: convert(text, k) }; });
  }

  /** Visible characters (grapheme clusters), e.g. an emoji with a skin tone counts as 1. */
  function countGraphemes(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      var n = 0, it = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text);
      for (var _ of it) n++; // eslint-disable-line no-unused-vars
      return n;
    }
    return Array.from(text).length;
  }

  /** UTF-16 code units — what many apps and games actually count. Fancy letters often count as 2. */
  function countUnits(text) { return text.length; }

  // Common display-name limits. Apps change these and may count fancy letters differently,
  // so always test the final name in the app itself.
  var LIMITS = {
    freeFire: 12, pubgMobile: 14, whatsappName: 25, instagramName: 30,
    tiktokName: 30, discordDisplayName: 32, xDisplayName: 50, robloxDisplayName: 20
  };

  /** Check a name against a platform limit using both counting methods. */
  function checkLimit(name, platform) {
    var limit = LIMITS[platform];
    if (!limit) throw new Error('Unknown platform: ' + platform);
    var g = countGraphemes(name), u = countUnits(name);
    return { platform: platform, limit: limit, visible: g, codeUnits: u,
             fitsVisible: g <= limit, fitsStrict: u <= limit };
  }

  return { STYLES: Object.keys(STYLES), LIMITS: LIMITS, convert: convert, convertAll: convertAll,
           countGraphemes: countGraphemes, countUnits: countUnits, checkLimit: checkLimit };
});
