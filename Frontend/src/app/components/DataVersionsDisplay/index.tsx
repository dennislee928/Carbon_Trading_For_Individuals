"use client";

import { useState, useEffect, useCallback } from "react";
import climatiqApi, { type DataVersionsResponse } from "@/app/services/api";

export default function DataVersionsDisplay() {
  const [versions, setVersions] = useState<DataVersionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataVersions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await climatiqApi.getDataVersions();
      setVersions(data ?? null); // Explicitly handle undefined
      setError(null);
    } catch (err) {
      setError("Failed to load data versions");
      console.error("Error fetching data versions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataVersions();
  }, [fetchDataVersions]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={fetchDataVersions}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Versions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Version Card */}
          <div className="border rounded-lg p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Latest Release
            </h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {versions?.latest_release}
            </div>
            <p className="text-sm text-blue-700">
              Recommended for fixed version usage
            </p>
            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <code className="text-sm text-blue-800">
                data_version: &quot;{versions?.latest_release}&quot;
              </code>
            </div>
          </div>

          {/* Dynamic Version Card */}
          <div className="border rounded-lg p-6 bg-green-50">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Dynamic Version
            </h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              ^{versions?.latest_release}
            </div>
            <p className="text-sm text-green-700">
              Recommended for latest dynamic version
            </p>
            <div className="mt-4 p-3 bg-green-100 rounded-md">
              <code className="text-sm text-green-800">
                data_version: &quot;^{versions?.latest_release}&quot;
              </code>
            </div>
          </div>
        </div>

        {/* Deprecated Versions Info */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Legacy Version Information
            <span className="ml-2 text-sm text-gray-500">(Deprecated)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Full Version</p>
              <p className="text-lg font-medium text-gray-900">
                {versions?.latest}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Major.Minor</p>
              <p className="text-lg font-medium text-gray-900">
                {versions?.latest_major}.{versions?.latest_minor}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            Note: The legacy version fields are deprecated. We recommend using
            the latest_release field for all new implementations.
          </p>
        </div>
      </div>
    </div>
  );
}
