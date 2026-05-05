const router = require("express").Router();
const formCtrl = require("../controllers/formCtrl");

router.post("/", formCtrl.createForm);
router.put("/:id", formCtrl.updateForm);
router.get("/:id", formCtrl.getForm);

module.exports = router;
