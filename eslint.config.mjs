import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

//export default eslintConfig;


export default [
  // โหลด config มาตรฐานของ Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // เพิ่ม rules เฉพาะที่เราต้องการ
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@next/next/no-css-tags": "off",
    },
  },
];
