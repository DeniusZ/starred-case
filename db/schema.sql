DROP TABLE IF EXISTS user;


CREATE TABLE user (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL
);

-- Drop the favorites table if it exists (in case we need to recreate it)
DROP TABLE IF EXISTS favorites;

-- Create the favorites table to store job favorites
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,  -- Assuming you track which user favorited the job
  FOREIGN KEY (job_id) REFERENCES jobs(id) -- Assuming you have a jobs table with job_id
);
