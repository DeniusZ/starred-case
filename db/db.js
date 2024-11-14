const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

// Create a connection to the SQLite database
function createDBConnection() {
  const db = new sqlite3.Database(
    path.resolve(__dirname, "starred.db"),
    (error) => {
      if (error) {
        return console.error("Error opening database:", error.message);
      }
    }
  );
  console.log("Connection with SQLite has been established");
  return db;
}

// Get all favorites for a specific user
function getFavoritesByUserId(userId, callback) {
  const db = createDBConnection();
  const query = `SELECT job_id FROM favorites WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
      return;
    }
    const jobIds = rows.map((row) => row.job_id);
    callback(null, jobIds);
  });
  db.close();
}

// Add a job to favorites for a specific user
function addFavoriteJob(userId, jobId, callback) {
  const db = createDBConnection();
  const query = `INSERT INTO favorites (user_id, job_id) VALUES (?, ?)`;

  db.run(query, [userId, jobId], function (err) {
    if (err) {
      console.error("Error inserting favorite job:", err.message);
      callback(err, null);
      return;
    }
    callback(null, { id: this.lastID });
  });
  db.close();
}

// Remove a job from favorites for a specific user
function removeFavoriteJob(userId, jobId, callback) {
  const db = createDBConnection();
  const query = `DELETE FROM favorites WHERE user_id = ? AND job_id = ?`;

  db.run(query, [userId, jobId], function (err) {
    if (err) {
      console.error(err.message);
      callback(err, null);
      return;
    }
    callback(null, { message: "Favorite removed successfully" });
  });

  db.close();
}

module.exports = {
  createDBConnection,
  getFavoritesByUserId,
  addFavoriteJob,
  removeFavoriteJob,
};
