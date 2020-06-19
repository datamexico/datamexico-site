export const stringNormalizer = (strToNormalize) => {
  const strNormalized = strToNormalize.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return strNormalized;
};
