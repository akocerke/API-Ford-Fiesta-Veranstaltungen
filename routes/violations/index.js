// routes/violations/index.js
const Router = require("express");
const ViolationsRouter = Router();

// Beispiel-Routen für Violations
ViolationsRouter.get("/", (req, res) => {
  res.json({ message: "List of violations" });
});




module.exports = { ViolationsRouter };
