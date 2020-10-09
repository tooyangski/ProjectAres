import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";

import CategoryTable from "./CategoryTable";

import ErrorNotification from "../../shared/components/notifications/ErrorNotification";
import CubeSpinner from "../../shared/components/loaders/CubeSpinner";

const ViewCategories = () => {
  const [isDataChanged, setIsDataChanged] = useState(0);
  const [loadedCategories, setCategories] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(`/api/category/?all=true`);
        setCategories(responseData.categories);
      } catch (err) {}
    };
    fetchCategories();
  }, [sendRequest, isDataChanged]);

  const categoryDataChanged = () => {
    setIsDataChanged((previousNumber) => (previousNumber += 1));
  };

  return (
    <div className="container mt-3">
      {error && (
        <ErrorNotification onClose={clearError}>{error}</ErrorNotification>
      )}

      {isLoading && <CubeSpinner />}

      <CategoryTable
        categories={loadedCategories}
        onDataChanged={categoryDataChanged}
        sendRequest={sendRequest}
      ></CategoryTable>
    </div>
  );
};

export default ViewCategories;
