"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Tooltip,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { SearchParams, EmissionFactor, UnitType } from "@/app/services/types"; // Ensure path is correct
import { climatiqApi } from "@/app/services/api"; // Ensure path is correct

export default function EmissionFactorsSearch() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "19",
    results_per_page: 20,
    page: 1,
    unit_type: "", // Ensure optional fields are initialized
  });

  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [dataVersions, setDataVersions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<EmissionFactor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [unitTypesData, dataVersionsData] = await Promise.all([
          climatiqApi.getUnitTypes(),
          climatiqApi.getDataVersions(),
        ]);

        setUnitTypes(unitTypesData.map((ut: UnitType) => ut.unit_type));
        setDataVersions([
          dataVersionsData.latest,
          dataVersionsData.latest_release,
        ]);
      } catch (error) {
        setError("Error fetching initial data");
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleTextChange =
    (field: keyof SearchParams) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof SearchParams) =>
    (event: SelectChangeEvent<string | number>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await climatiqApi.searchEmissionFactors(searchParams);
      setSearchResults(response.results);
    } catch (error) {
      setError("Error performing search");
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: 1,
        borderColor: "grey.300",
        borderRadius: 1,
        backgroundColor: "background.paper",
        boxShadow: 1,
        "&:hover": {
          boxShadow: 2,
          borderColor: "primary.main",
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Vague Emission Factors Search
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tooltip title="Free-text search that matches IDs, names, and descriptions. Uses fuzzy matching.">
            <TextField
              fullWidth
              label="Search Query"
              value={searchParams.query || ""}
              onChange={handleTextChange("query")}
            />
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Data Version</InputLabel>
            <Select
              value={searchParams.data_version}
              onChange={handleSelectChange("data_version")}
              label="Data Version"
            >
              {dataVersions.map((version) => (
                <MenuItem key={version} value={version}>
                  Version {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Unit Type</InputLabel>
            <Select
              value={searchParams.unit_type || ""}
              onChange={handleSelectChange("unit_type")}
              label="Unit Type"
            >
              {unitTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        {searchResults.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {searchResults.map((result) => (
              <Box
                key={result.id}
                sx={{
                  mb: 3,
                  p: 2,
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  backgroundColor: "background.paper",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary">
                      {result.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Basic Information
                    </Typography>
                    <Typography>
                      <strong>ID:</strong> {result.id}
                    </Typography>
                    <Typography>
                      <strong>Activity ID:</strong>{" "}
                      {result.example_activity_id ?? "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Additional Information
                    </Typography>
                    <Typography>
                      <strong>Data Quality Flags:</strong>{" "}
                      {result.data_quality_flags?.join(", ") || "None"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
