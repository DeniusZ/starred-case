import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import styled from "styled-components";

const LOCAL_API_URL = "http://localhost:3001/jobs";

const JobCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const JobTitle = styled(Typography)`
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 8px;
`;

const JobDescription = styled(Typography)`
  font-size: 0.875rem;
  color: #555;
  margin-top: 8px;
`;

const JobCompany = styled(Typography)`
  font-size: 1rem;
  color: #333;
`;

function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = `${LOCAL_API_URL}?page=1`;
        console.log("Fetching jobs from:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching jobs");
        const data = await response.json();
        setJobs(data.data);
        setFilteredJobs(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const addFavorite = async (jobId) => {
    try {
      const response = await fetch(`${LOCAL_API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          jobId,
        }),
      });

      if (!response.ok) throw new Error("Error adding favorite");
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Failed to add favorite:", error.message);
    }
  };

  const removeFavorite = async (jobId) => {
    try {
      const response = await fetch(`${LOCAL_API_URL}/favorites/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
        }),
      });

      if (!response.ok) throw new Error("Error removing favorite");

      setFavorites((prevFavorites) =>
        prevFavorites.filter((job) => job.id !== jobId)
      );
    } catch (error) {
      console.error("Failed to remove favorite:", error.message);
    }
  };

  const handleFavorite = (jobId) => {
    if (showFavorites) {
      removeFavorite(jobId);
    } else {
      addFavorite(jobId);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${LOCAL_API_URL}/favorites?userId=1`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching favorites");
      }

      const data = await response.json();
      console.log("data", data);
      setFavorites(data);
      setShowFavorites(true);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  console.log("showFavorites", showFavorites);
  console.log("favorites", favorites);

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to the Job Listings
      </Typography>
      {error && (
        <Typography
          color="error"
          align="center"
        >{`Error: ${error}`}</Typography>
      )}

      <TextField
        label="Search by Job Title"
        variant="outlined"
        fullWidth
        style={{ marginBottom: "20px" }}
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={fetchFavorites}
        style={{ marginBottom: "20px" }}
      >
        Your Favorites
      </Button>

      <Grid container spacing={4}>
        {(showFavorites ? favorites : filteredJobs)?.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <JobCard>
              <CardContent>
                <JobTitle>{job.job_title}</JobTitle>
                <JobCompany>{job.company}</JobCompany>
                <JobDescription>{job.description}</JobDescription>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "16px" }}
                  onClick={() => handleFavorite(job.id)}
                >
                  {showFavorites
                    ? "Remove from Favorites"
                    : "Save to Favorites"}
                </Button>
              </CardContent>
            </JobCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
