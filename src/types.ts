export type TCompressedData = {
  /**
   * struct of compressed data
   */
  struct: any;
  /**
   * compressed data
   */
  data: any;
}

export type TCompressOptions = {
  /**
   * whether to convert empty array or object to null, default is false
   */
  emptyCollectionToNull?: boolean;
}
