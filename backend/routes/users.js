const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const user = new UserController();

router.get("/", async (req, res) => user.list(req, res));
router.get("/:id", async (req, res) => user.getUser(req, res));
router.post("/add", async (req, res) => user.add(req, res));
router.put("/edit/:id", async (req, res) => user.edit(req, res));
router.delete("/delete/:id", async (req, res) => user.delete(req, res));

module.exports = router;
