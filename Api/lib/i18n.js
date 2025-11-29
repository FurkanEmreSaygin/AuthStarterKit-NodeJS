const i18n = require("../i18n");

class I18n {
  constructor(lang) {
    this.lang = lang;
  }

  translate(text, lang = this.lang, params = []) {
    let arr = text.split(".");
    let currentLang = lang || this.lang;

    if (!i18n[currentLang]) {
      if (i18n[currentLang?.toUpperCase()]) {
        currentLang = currentLang.toUpperCase();
      } else {
        currentLang = "EN";
      }
    }
    let val = i18n[currentLang][arr[0]];

    if (!val) return text;

    for (let i = 1; i < arr.length; i++) {
      val = val[arr[i]];
      if (!val) return text;
    }

    val = val + "";

    for (let i = 0; i < params.length; i++) {
      val = val.replace("{}", params[i]);
    }

    return val;
  }
}

module.exports = I18n;
