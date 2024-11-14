const express = require("express");
const axios = require("axios");
const router = express.Router();
const {
  addFavoriteJob,
  getFavoritesByUserId,
  removeFavoriteJob,
} = require("../../db/db");

// External API base URL
const EXTERNAL_API_URL =
  "https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs";

// Get all jobs (or filtered by title)
router.get("/", async (req, res) => {
  try {
    const { title, page = 1 } = req.query;
    let apiUrl = `${EXTERNAL_API_URL}?page=${page}`;

    if (title) {
      apiUrl = `${EXTERNAL_API_URL}/recommendations`;
    }

    const response = await axios.get(apiUrl, {
      params: title ? { jobTitle: title } : {},
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching jobs" });
  }
});

router.get("/favorites", async (req, res) => {
  const { userId } = req.query;

  console.log("USER_ID", userId);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  try {
    getFavoritesByUserId(userId, async (err, jobIds) => {
      if (err) {
        return res.status(500).json({ error: "Error retrieving favorites" });
      }
      const uniqueJobIds = [...new Set(jobIds)];

      console.log("uniqueJobIds", uniqueJobIds);

      const favoriteJobs = await Promise.all(
        uniqueJobIds.map(async (jobId) => {
          const response = await axios.get(`${EXTERNAL_API_URL}/${jobId}`);
          return response.data;
        })
      );

      res.json(favoriteJobs);
    });
  } catch (error) {
    console.error("Error fetching favorite jobs:", error);
    res.status(500).json({ error: "Error fetching favorite jobs" });
  }
});

// Get job details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${EXTERNAL_API_URL}/${id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      console.error(
        "External API error:",
        err.response.status,
        err.response.data
      );
      res.status(err.response.status).json({
        error: err.response.data.error || "Error fetching job details",
      });
    } else {
      console.error("Network or unknown error:", err.message);
      res.status(500).json({ error: "Error fetching job details" });
    }
  }
});

// Mark job as favorite
router.post("/favorites", (req, res) => {
  const { userId, jobId } = req.body;
  console.log(`Job ${jobId} marked as favorite by user ${userId}`);

  addFavoriteJob(userId, jobId, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error adding favorite", error: err.message });
    } else {
      res
        .status(200)
        .json({ message: `Job ${jobId} marked as favorite`, id: result.id });
    }
  });
});

router.delete("/favorites/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.body;

  if (!userId || !jobId || isNaN(userId) || isNaN(jobId)) {
    return res.status(400).json({ error: "Invalid userId or jobId" });
  }

  try {
    removeFavoriteJob(userId, jobId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error removing favorite" });
      }
      res.json(result);
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Error removing favorite" });
  }
});

module.exports = router;
