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
import { SearchParams, EmissionFactor, UnitType } from "@/app/services/types"; // Update import path for types
import { climatiqApi } from "@/app/services/api"; // Update import for API

export default function EmissionFactorsSearch() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "19",
    results_per_page: 20,
    page: 1,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vague Emission Factors Search
      </Typography>
      <Grid container spacing={3}>
        {/* Search Query */}
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

        {/* Data Version */}
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

        {/* Unit Type */}
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

        {/* Search Button */}
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

        {/* Error Message */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {searchResults.map((result) => (
              <Box
                key={result.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle1">{result.name}</Typography>
                <Typography variant="body2">ID: {result.id}</Typography>
                <Typography variant="body2">
                  Category: {result.category}
                </Typography>
                {result.sector && (
                  <Typography variant="body2">
                    Sector: {result.sector}
                  </Typography>
                )}
                <Typography variant="body2">Source: {result.source}</Typography>
                <Typography variant="body2">Region: {result.region}</Typography>
                <Typography variant="body2">Year: {result.year}</Typography>
              </Box>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
