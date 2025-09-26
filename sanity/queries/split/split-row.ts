// sanity/queries/split/split-row.ts
import { groq } from "next-sanity";
import { splitContentQuery } from "./split-content";
import { splitCardsListQuery } from "./split-cards-list";
import { splitImageQuery } from "./split-image";
import { splitInfoListQuery } from "./split-info-list";

// @sanity-typegen-ignore
export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    sectionId,
    noGap,
    splitColumns[]{
      ${splitContentQuery},
      ${splitCardsListQuery},
      ${splitImageQuery},
      ${splitInfoListQuery},
    },
  }
`;
