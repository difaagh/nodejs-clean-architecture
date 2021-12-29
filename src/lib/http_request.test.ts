import { HttpRequest } from "./http_request";

describe("test http request function", () => {
  it("should response 200 ok", async (done) => {
    const response = await HttpRequest("https://google.com", "/", "GET");
    expect(response.status).toBe(200);
    done();
  });
});
