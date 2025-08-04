const express = require('express');
const sanitize = require('./middlewares/sanitize');
const ItemController = require('./controllers/itemController');
const router = express.Router();


router.get('/parents', ItemController.getParentNodes);
router.get('/childnode/:id', ItemController.getNodeById);
router.post('/createparentnode',  ItemController.createParentNode);
router.post('/childnode',  ItemController.createChildNode);
router.patch('/editlabel',  ItemController.EditNodeLabel);
router.delete('/deletenode:id', ItemController.deleteNode);

module.exports = router;
