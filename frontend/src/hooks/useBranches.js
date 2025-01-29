// hooks/useBranches.js
import { useState, useEffect } from 'react';
import { fetchAllBranches, fetchBranchById } from '../services/branchService';
import { updateBranchById } from '../services/branchService';

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

const useBranchById = (branchId) => {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBranch = async () => {
      try {
        const data = await fetchBranchById(branchId);
        setBranch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (branchId) {
      loadBranch();
    }
  }, [branchId]);

  return { branch, loading, error };
};

const useUpdateBranch = () => {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateBranch = async (id,branchData) => {
    setUpdating(true);
    setUpdateError(null);
    setSuccess(false);
    try {
      console.log(branchData);
       await updateBranchById(id,branchData);
      setSuccess(true);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return { updateBranch, updating, updateError, success };
};


export { useBranches, useBranchById, useUpdateBranch };
