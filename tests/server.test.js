const request = require("supertest");
const app = require("../index");
let token = "";
describe("User Registration and Login", () => {
  test("User Registration", async () => {
    const response = await request(app).post("/register").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully."
    );
  });

  test("User Login", async () => {
    const response = await request(app).get("/login").send({
      email: "testuser@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  test("Secure Route", async () => {
    console.log(token);
    const response = await request(app)
      .get("/secure-endpoint")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "This is a secure endpoint."
    );
  });
  test("Rate Limiting", async () => {
    const results = [];
    for (let index = 0; index < 10; index++) {
      const response = await request(app)
        .get("/secure-endpoint")
        .set("Authorization", token);

      results.push(response);
    }
    await Promise.all(results);
    expect(results.find((el) => el.statusCode === 429)).not.toEqual(undefined);
  });
});
