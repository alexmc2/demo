// sanity/schemas/blocks/shared/color-variant.ts
import { defineType } from "sanity";

export const COLOR_VARIANTS = [
  { title: "Background", value: "background" },
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Card", value: "card" },
  { title: "Accent", value: "accent" },
  { title: "Destructive", value: "destructive" },
  { title: "Muted", value: "muted" },
  { title: "White", value: "white" },
  { title: "Light Gray", value: "light-gray" },
  { title: "Cool Gray", value: "cool-gray" },
  { title: "Soft Blue", value: "soft-blue" },
  { title: "Sky Blue", value: "sky-blue" },
  { title: "Mint", value: "mint" },
  { title: "Sand", value: "sand" },
  { title: "Peach", value: "peach" },
  { title: "Slate", value: "slate" },
  { title: "Navy", value: "navy" },
  { title: "Charcoal", value: "charcoal" },
];

export const colorVariant = defineType({
  name: "color-variant",
  title: "Color Variant",
  type: "string",
  options: {
    list: COLOR_VARIANTS.map(({ title, value }) => ({ title, value })),
  },
  initialValue: "background",
});
