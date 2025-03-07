const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/users");

let response = null;

// This is not needed because app comes with the connection to the db
// beforeAll(async () => {
//   const connectionString = process.env.CONNECTION_STRING;
//   await mongoose.connect(connectionString, { connectTimeoutMS: 2000 });
// });

afterAll(async () => {
  if (response) {
    await User.findOneAndDelete({ email: "john.perez@example.com" });
  }
  await mongoose.connection.close();
});

describe("User authentification", () => {
  it("should sign up a user", async () => {
    const res = await request(app).post("/user/signup").send({
      firstname: "John",
      lastname: "Perez",
      email: "john.perez@example.com",
      password: "azert123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);

    response = res.body.result;
  });

  it("should sign in a registered user", async () => {
    if (!response) {
      throw new Error("User not signed up");
    }

    const res = await request(app).post("/user/signin").send({
      email: "john.perez@example.com",
      password: "azert123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
  });
});
