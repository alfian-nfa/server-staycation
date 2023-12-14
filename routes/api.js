const express = require("express");
const apiController = require("../controllers/apiController");
const { upload } = require("../middlewares/multer");

const router = express.Router(); // Change this line to use express.Router()

// Define routes
router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);
router.post("/booking-page", upload, apiController.bookingPage);
router.post("/signin", apiController.actionSignin);
router.get("/item/show-image/:id", apiController.showImageItem);

module.exports = router;
