import { NewHttpRequest } from "./http_request";

test("http-request-get", async () => {
  const response = await NewHttpRequest("https://google.com", "/", "GET", null);
  expect(response.status).toBe(200);
});
