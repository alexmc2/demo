// sanity/queries/shared/image.ts
export const imageQuery = `
  ...,
  asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
        width,
        height
      }
    }
  }
`;
