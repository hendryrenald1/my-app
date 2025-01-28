// hooks/useBranches.js
import { useState, useEffect } from 'react';
import { fetchAllBranches } from '../services/branchService';

const useBranches = (initialPage = 1, initialLimit = 10) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [totalCount, setTotalCount] = useState(0); // Store total number of branches


  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchAllBranches(page, limit);
        setBranches(data.branches);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, [page, limit]);

  const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

  return { branches, loading, error, page, setPage, totalPages };
};

export default useBranches;
