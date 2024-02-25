import { Endpoint } from "../config/types";

export const createQueryParams = (
  params: Endpoint["destination"]["params"],
) => {
  if (!params) {
    return "";
  }

  return "?" + params.map((param) => `${param.key}=${param.value}`).join("&");
};
