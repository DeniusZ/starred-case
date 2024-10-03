DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL
);