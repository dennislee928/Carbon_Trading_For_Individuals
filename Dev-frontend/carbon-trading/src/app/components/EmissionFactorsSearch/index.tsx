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
  const createSearchParams = (params: SearchParamsType): URLSearchParams => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value.toString());
      }
    });

    return searchParams;
  };

  const fetchUnitTypes = async (): Promise<UnitType[]> => {
    try {
      const response = await fetch("/api/unit-types");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching unit types:", error);
      return [];
    }
  };

  const fetchDataVersions = async (): Promise<DataVersions> => {
    try {
      const response = await fetch("/api/data-versions");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data versions:", error);
      return { latest: "19", latest_release: "18" };
    }
  };

  const handleSearch = async () => {
    try {
      const params = createSearchParams(searchParams);
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      console.log("Search Results:", data); // Handle the search results accordingly
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const [searchParams, setSearchParams] = useState<SearchParamsType>({
    data_version: "19",
    results_per_page: 20,
    page: 1,
  });

  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [dataVersions, setDataVersions] = useState<string[]>([]);

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
        {/* Unit Type Selector */}
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
      </Grid>
    </Box>
  );
}
