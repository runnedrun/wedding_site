export const isEmptyObject = (obj: object) =>
  !Object.values(obj).filter((_) => _).length
