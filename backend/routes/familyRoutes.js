const express = require('express');
const { getFamilyTree } = require('../services/familyService');
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllBranches } = require('../services/branchService');
const router = express.Router();

// Route to get family tree for a given person
router.get('/family-tree/:personId', verifyToken, async (req, res) => {
  const { personId } = req.params;

  try {
    const familyTree = await getFamilyTree(personId);
    res.status(200).json(familyTree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all branches 
router.get('/branches', verifyToken, async (req, res) => {
  try {
    const branches = await getAllBranches();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to check if the service is active
router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Service is active' });
});

module.exports = router;
