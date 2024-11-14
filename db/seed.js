const { faker } = require("@faker-js/faker");
const fs = require("fs");
const { db } = require("./db.js"); // Access the single db instance

function generateJobs(num) {
  const jobs = [];
  for (let i = 0; i <= num; i++) {
    jobs.push({
      title: faker.person.jobTitle(),
      description: faker.person.jobDescriptor(),
      type: faker.person.jobType(),
      area: faker.person.jobArea(),
      state: faker.location.state(),
      streetAddress: faker.location.streetAddress(),
    });
  }
  return jobs;
}

function generateUsers(num) {
  const users = [];
  for (let i = 0; i <= num; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      salt: faker.lorem.word(),
    });
  }
  return users;
}

function reset() {
  const sql = fs.readFileSync(__dirname + "/schema.sql").toString();

  db.serialize(() => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Error executing schema:", err.message);
      } else {
        console.log("Schema executed successfully");
        seed();
      }
    });
  });
}

function seed() {
  const users = generateUsers(10);

  db.serialize(() => {
    const stmt = db.prepare(
      "INSERT INTO user (firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?)"
    );

    users.forEach((user) => {
      stmt.run(
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.salt,
        (err) => {
          if (err) {
            console.error("Error inserting user:", err.message);
          }
        }
      );
    });

    stmt.finalize(() => {
      console.log("Users seeded successfully");
      db.close();
    });
  });
}

reset();
