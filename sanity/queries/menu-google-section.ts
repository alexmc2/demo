// sanity/queries/menu-google-section.ts
import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const menuGoogleSectionQuery = groq`
  _type == "menu-google-section" => {
    _type,
    _key,
    padding,
    sectionId,
    eyebrow,
    title,
    intro,
    accordionBehaviour,
    appearance{
      backgroundColor,
      panelColor,
      accentColor
    },
    categories[]{
      _key,
      title,
      tagline,
      itemEntryMode,
      items[]{
        _key,
        name,
        price,
        description,
        dietary
      },
      rawItems
    }
  }
`;
