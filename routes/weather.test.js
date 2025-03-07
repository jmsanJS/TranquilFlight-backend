const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

// This is not needed because app comes with the connection to the db
// beforeAll(async () => {
//   const connectionString = process.env.CONNECTION_STRING;
//   await mongoose.connect(connectionString, { connectTimeoutMS: 2000 });
// });

afterAll(async () => {
  await mongoose.connection.close();
});

it('fetching data from weather API', async () => {
  const res = await request(app).get("/weather/paris");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
})