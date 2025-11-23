import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // Tüm JS dosyalarına uygulanacak temel kurallar
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      // Node.js'e özgü global değişkenleri (require, module, process vb.) tanır
      globals: globals.node,
    },

    rules: {
      // 1. Kullanılmayan değişkenler kuralını etkin tutarız (error).
      // Ancak 'argsIgnorePattern' ile fonksiyon parametreleri arasındaki 'next' kelimesini görmezden gelmesini söyleriz.
      "no-unused-vars": ["error", { argsIgnorePattern: "^(_|next)" }],

      // 2. Tırnak işaretlerini tek tırnak yapabilirsiniz (isteğe bağlı)
      // "quotes": ["error", "single"],

      // 3. console.log kullanımına sadece uyarı verir (error yerine warn)
      "no-console": "warn",
    },
  },
  {
    // Sadece .js dosyalarının CommonJS modül kullandığını belirtir (require/exports)
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
]);
