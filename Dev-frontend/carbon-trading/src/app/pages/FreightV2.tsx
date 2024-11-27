// pages/search.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars

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
  //searchEmissionFactors,
  getUnitTypes,
  getDataVersions,
  //SearchParams,
  EmissionFactor,
  FreightEmissionRequest,
  calculateFreightEmissions,
} from "../services/api";
import { SelectChangeEvent } from "@mui/material";
//
interface SearchParams {
  data_version: string;
  results_per_page: number; // Keep as number in the interface
  page: number; // Keep as number in the interface
  unit_type?: string;
  query?: string;
}
//
const FreightV2 = () => {
  const [unitTypes, setUnitTypes] = useState<string[]>([]);
  const [dataVersions, setDataVersions] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "19",
    results_per_page: 10, // Number
    page: 1, // Number
  });

  const [results] = useState<EmissionFactor[] | null>(null); //[, setResults]
  const [loading] = useState(false); //[, setLoading]

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

  // For Select components
  const handleSelectChange =
    (field: keyof SearchParams) => (event: SelectChangeEvent) => {
      const value = event.target.value;
      setSearchParams((prev) => ({
        ...prev,
        [field]:
          field === "results_per_page" || field === "page"
            ? Number(value)
            : value,
      }));
    };

  //used later disable now for eslint regulations
  //const handleSearch = async () => {
  //setLoading(true);
  //try {
  // const response = await searchEmissionFactors(searchParams);
  // setResults(response.results);
  //} catch (error) {
  //  console.error("Error during search:", error);
  //  setResults([]);
  //} finally {
  //  setLoading(false);
  // }
  //};
  //
  const handleFreightEmissionCalculation = async () => {
    const payload: FreightEmissionRequest = {
      route: [
        { location: { query: "Hamburg" } },
        {
          transport_mode: "road",
          leg_details: {
            rest_of_world: {
              vehicle_type: "van",
              vehicle_weight: "lte_3.5t",
              fuel_source: "petrol",
            },
          },
        },
        { location: { query: "Berlin" } },
      ],
      cargo: {
        weight: 10,
        weight_unit: "t",
      },
    };

    try {
      const response = await calculateFreightEmissions(payload);
      console.log("Freight Emissions:", response);
    } catch (error) {
      console.error("Error calculating freight emissions:", error);
    }
  };
  //
  {
    /* Page Select */
  }
  <Grid item xs={12} md={6}>
    <FormControl fullWidth>
      <InputLabel>Page</InputLabel>
      <Select
        value={String(searchParams.page)} // Convert to string for Select
        onChange={handleSelectChange("page")}
        label="Page"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <MenuItem key={num} value={String(num)}>
            {num}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>;
  //
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
              value={String(searchParams.results_per_page)} // Convert to string for Select
              onChange={handleSelectChange("results_per_page")}
              label="Results Per Page"
            >
              {[10, 20, 50, 100].map((num) => (
                <MenuItem key={num} value={String(num)}>
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
            onClick={handleFreightEmissionCalculation} // Should be handleSearch
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
      {/* Results Per Page */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Results Per Page</InputLabel>
          <Select
            value={String(searchParams.results_per_page)} // Convert to string
            onChange={handleSelectChange("results_per_page")}
            label="Results Per Page"
          >
            {[10, 20, 50, 100].map((num) => (
              <MenuItem key={num} value={String(num)}>
                {" "}
                {/* Convert to string */}
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

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
