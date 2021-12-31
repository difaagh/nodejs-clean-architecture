import Axios, { AxiosResponse } from "axios";
import { BadRequestError } from "@exception/index";

export type IHttpRequest = typeof NewHttpRequest;

export type HttpResponse<T> = AxiosResponse<T>;

export type HttpRequestImpl = {
  host: string;
  httpRequest: IHttpRequest;
};

export async function NewHttpRequest<T>(
  host: string,
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  data?: {
    body?: any;
    headers?: any;
  },
  disableConsole?: boolean
): Promise<HttpResponse<T>> {
  try {
    const url = `${host}${path}`;
    const request = await Axios(url, {
      method,
      data: data ? data.body : undefined,
      headers: data ? data.headers : undefined,
    });
    return request;
  } catch (error) {
    // eslint:disable
    if (!disableConsole) {
      console.error("####### ERROR #######");
      if (error.response !== undefined) {
        if (!disableConsole) {
          console.error("url = ", error.config.url ? error.config.url : "");
          console.error("data = ", error.config.data ? JSON.stringify(error.config.data) : "");
          console.error("method = ", error.config.method ? error.config.method : "");
          console.error("headers = ", error.config.headers ? error.config.headers : "");
        }
        if (error.response.status === 404) {
          if (!disableConsole) {
            console.error(`${error.config.url ? error.config.url : "url"} not found`);
            console.error("####### END ERROR #######");
          }
          throw new BadRequestError(`${error.config.url ? error.config.url : "url"} not found`, "HTTP_REQUEST_ERROR");
        }
        if (error.response.data !== undefined) {
          if (error.response.data.message) {
            if (!disableConsole) {
              console.error(error.response.data.message);
              console.error("####### END ERROR #######");
            }
            throw new BadRequestError(error.response.data.message, "HTTP_REQUEST_ERROR");
          } else {
            if (!disableConsole) {
              console.error(JSON.stringify(error.response.data));
              console.error("####### END ERROR #######");
            }
            throw new BadRequestError(JSON.stringify(error.response.data), "HTTP_REQUEST_ERROR");
          }
        }
      } else {
        if (!disableConsole) {
          console.log(error.config);
          console.error("####### END ERROR #######");
        }
        throw new BadRequestError(error.message, "HTTP_REQUEST_ERROR");
      }
    } else {
      throw new BadRequestError(error.message, "HTTP_REQUEST_ERROR");
    }
  }
}
