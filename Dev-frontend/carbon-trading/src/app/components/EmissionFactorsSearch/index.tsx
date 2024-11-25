// Dev-frontend/carbon-trading/src/app/components/EmissionFactorsSearch/index.tsx
/* eslint-disable */
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
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

// Define interfaces
interface UnitType {
  unit_type: string;
}

interface DataVersions {
  latest: string;
  latest_release: string;
}

interface SearchParamsType {
  data_version: string;
  results_per_page: number;
  page: number;
  query?: string;
  year?: string;
  category?: string;
  sector?: string;
  unit_type?: string;
  calculation_method?: string;
  region?: string;
  access_type?: string;
}

export default function EmissionFactorsSearch() {
  //
  const createSearchParams = (params: SearchParamsType): URLSearchParams => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value.toString());
      }
    });

    return searchParams;
  };

  //
  const fetchUnitTypes = async (): Promise<UnitType[]> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/unit-types");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching unit types:", error);
      return [];
    }
  };
  //
  const fetchDataVersions = async (): Promise<DataVersions> => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/data-versions");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data versions:", error);
      return { latest: "19", latest_release: "18" };
    }
  };
  //
  const handleSearch = async () => {
    try {
      const params = createSearchParams(searchParams);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      // Handle the search results
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
  //
  const [searchParams, setSearchParams] = useState<SearchParamsType>({
    data_version: "19",
    results_per_page: 20,
    page: 1,
  });
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [dataVersions, setDataVersions] = useState<string[]>([]);

  // Predefined options for select fields
  const calculationMethods = ["ar4", "ar5", "ar6"];
  const accessTypes = ["public", "private", "premium"];
  const years = Array.from(
    { length: 2024 - 1990 + 1 },
    (_, i) => 1990 + i
  ).reverse();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [unitTypesData, dataVersionsData] = await Promise.all([
          fetchUnitTypes(),
          fetchDataVersions(),
        ]);

        setUnitTypes(unitTypesData.map((ut: UnitType) => ut.unit_type));
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
  useEffect(() => {
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const handleTextChange =
    (field: keyof SearchParamsType) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof SearchParamsType) =>
    (event: SelectChangeEvent<string | number>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Emission Factors Search
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

        {/* Year */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={searchParams.year || ""}
              onChange={handleSelectChange("year")}
              label="Year"
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Filter by the most relevant year</FormHelperText>
          </FormControl>
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6}>
          <Tooltip title="Filter emission factors by category">
            <TextField
              fullWidth
              label="Category"
              value={searchParams.category || ""}
              onChange={handleTextChange("category")}
              helperText="Enter a specific category to filter results"
            />
          </Tooltip>
        </Grid>

        {/* Sector */}
        <Grid item xs={12} md={6}>
          <Tooltip title="Filter emission factors by sector">
            <TextField
              fullWidth
              label="Sector"
              value={searchParams.sector || ""}
              onChange={handleTextChange("sector")}
              helperText="Enter a specific sector to filter results"
            />
          </Tooltip>
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
            <FormHelperText>Filter by measurement unit type</FormHelperText>
          </FormControl>
        </Grid>

        {/* Calculation Method */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Calculation Method</InputLabel>
            <Select
              value={searchParams.calculation_method || ""}
              onChange={handleSelectChange("calculation_method")}
              label="Calculation Method"
            >
              <MenuItem value="">Default (Latest)</MenuItem>
              {calculationMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the GWP calculation method</FormHelperText>
          </FormControl>
        </Grid>

        {/* Region */}
        <Grid item xs={12} md={6}>
          <Tooltip title="Use * as wildcard (e.g., 'US*' matches USA, USC)">
            <TextField
              fullWidth
              label="Region"
              value={searchParams.region || ""}
              onChange={handleTextChange("region")}
              helperText="Enter region code (supports wildcard *)"
            />
          </Tooltip>
        </Grid>

        {/* Access Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Access Type</InputLabel>
            <Select
              value={searchParams.access_type || ""}
              onChange={handleSelectChange("access_type")}
              label="Access Type"
            >
              <MenuItem value="">All Access Types</MenuItem>
              {accessTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Filter by access level</FormHelperText>
          </FormControl>
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
              {[10, 20, 50, 100, 200, 500].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Number of results to display per page (max 500)
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
