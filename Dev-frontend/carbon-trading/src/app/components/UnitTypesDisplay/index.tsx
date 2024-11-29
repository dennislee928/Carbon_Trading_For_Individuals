"use client";
import React, { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material"; // Ensure this import exists
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import climatiqApi, { UnitType } from "@/app/services/api";

interface UnitTypesDisplayProps {
  onUnitTypeSelect?: (unitType: string, unit: string) => void;
}

const UnitTypesDisplay: React.FC<UnitTypesDisplayProps> = ({
  onUnitTypeSelect,
}) => {
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnitType, setSelectedUnitType] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        setLoading(true);
        const data = await climatiqApi.getUnitTypes(); // Correctly use climatiqApi object
        if (Array.isArray(data)) {
          setUnitTypes(data);
        } else {
          throw new Error("Invalid data format received");
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch unit types"
        );
        setUnitTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitTypes();
  }, []);

  const handleUnitTypeChange = (event: SelectChangeEvent<string>) => {
    const newUnitType = event.target.value;
    setSelectedUnitType(newUnitType);
    setSelectedUnit("");
  };

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    const newUnit = event.target.value;
    setSelectedUnit(newUnit);
    if (onUnitTypeSelect && selectedUnitType) {
      onUnitTypeSelect(selectedUnitType, newUnit);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const selectedTypeData = unitTypes.find(
    (type) => type.unit_type === selectedUnitType
  );
  const availableUnits = selectedTypeData
    ? Object.values(selectedTypeData.units).flat()
    : [];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Unit Types Selection
      </Typography>
      <Grid container spacing={3}>
        {/* Unit Type Selector */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Unit Type</InputLabel>
            <Select
              value={selectedUnitType}
              onChange={handleUnitTypeChange}
              label="Unit Type"
            >
              <MenuItem value="">
                <em>Select a unit type</em>
              </MenuItem>
              {unitTypes.map((type) => (
                <MenuItem key={type.unit_type} value={type.unit_type}>
                  {type.unit_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Unit Selector */}
        {selectedUnitType && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Unit</InputLabel>
              <Select
                value={selectedUnit}
                onChange={handleUnitChange}
                label="Unit"
              >
                <MenuItem value="">
                  <em>Select a unit</em>
                </MenuItem>
                {availableUnits.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UnitTypesDisplay;
