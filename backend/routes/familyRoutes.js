const express = require('express');
const { getFamilyTree } = require('../services/familyService');
const { verifyToken } = require('../middleware/authMiddleware');
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

module.exports = router;
