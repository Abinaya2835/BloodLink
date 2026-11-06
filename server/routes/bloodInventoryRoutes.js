
const express = require("express");

const {
    getInventory,
    addOrUpdateInventory,
    searchBloodBanks
} = require("../controllers/bloodInventoryController");

const router = express.Router();

// IMPORTANT: Keep /search before /:userId
router.get("/search", searchBloodBanks);

// Get inventory for a specific blood bank
router.get("/:userId", getInventory);

// Add or update blood stock
router.put("/:userId", addOrUpdateInventory);

module.exports = router;
