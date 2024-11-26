// pages/search.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  searchEmissionFactors,
  getUnitTypes,
  getDataVersions,
  SearchParams,
  EmissionFactor,
} from "../services/api";

const FreightV2 = () => {
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [dataVersions, setDataVersions] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "19",
    results_per_page: 10,
    page: 1,
  });
  const [results, setResults] = useState<EmissionFactor[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const unitTypesData = await getUnitTypes();
        const dataVersionsData = await getDataVersions();

        setUnitTypes(unitTypesData.map((ut) => ut.unit_type));
        setDataVersions([
          dataVersionsData.latest,
          dataVersionsData.latest_release,
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange =
    (field: keyof SearchParams) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof SearchParams) =>
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target as string,
      }));
    };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchEmissionFactors(searchParams);
      setResults(response.results);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Emission Factors Search
      </Typography>

      <Grid container spacing={2}>
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
                  {version}
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
              <MenuItem value="">All Unit Types</MenuItem>
              {unitTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Query */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search Query"
            value={searchParams.query || ""}
            onChange={handleInputChange("query")}
          />
        </Grid>

        {/* Results Per Page */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Results Per Page</InputLabel>
            <Select
              value={searchParams.results_per_page}
              onChange={handleSelectChange("results_per_page")}
              label="Results Per Page"
            >
              {[10, 20, 50, 100].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
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
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Search Results */}
      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Search Results</Typography>
          {results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  {result.name} - {result.category}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No results found.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FreightV2;
