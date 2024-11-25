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

interface SearchParams {
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

// Define API functions
async function fetchUnitTypes(): Promise<UnitType[]> {
  try {
    const response = await fetch("/api/unit-types");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching unit types:", error);
    return [];
  }
}

async function fetchDataVersions(): Promise<DataVersions> {
  try {
    const response = await fetch("/api/data-versions");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data versions:", error);
    return { latest: "19", latest_release: "18" };
  }
}

export default function EmissionFactorsSearch() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "^19",
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

  const handleTextChange =
    (field: keyof SearchParams) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof SearchParams) => (event: SelectChangeEvent) => {
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
              onChange={handleChange("category")}
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
              onChange={handleChange("sector")}
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
              onChange={handleChange("unit_type")}
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
              onChange={handleChange("calculation_method")}
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
              onChange={handleChange("region")}
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
              onChange={handleChange("access_type")}
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
              onChange={handleChange("results_per_page")}
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
