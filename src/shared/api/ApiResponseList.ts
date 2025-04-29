interface ApiResponseType {
  limit: number;
  skip: number;
  total: number;
}

export type ApiResponseList<T, K extends string> = ApiResponseType & {
  [key in K]: T[];
};
