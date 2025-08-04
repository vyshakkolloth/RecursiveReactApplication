
const NodeModel = require('../models/nodeModal.js');
const {buildTreeFromRootNodes,deleteNodeRecursively} = require('../common/buildTreeFromRootNodes.js');

class ItemController {



  async getParentNodes(req, res, next) {

    try {
        const tree = await buildTreeFromRootNodes();
        res.status(200).json(tree);
      
    } catch (err) {
      next(err);
    }
  };

  async getNodeById(req, res, next) {
    try {
      res.status(200).json({ message: "Node retrieved successfully" });
    } catch (error) {

    }
  }

  async createParentNode(req, res, next) {
    try {

      const name = req?.body?.name || "new node";

      const parentNode =await NodeModel.create({ name: name, parent: null })



      res.status(200).json({ message: "Node Created successfully",data: parentNode });

    } catch (error) {
      res.status(500).json({ message: "Error creating parent node", error: error.message });
      next(error);
    }
  }

  async createChildNode(req, res, next) {
    try {
    console.log(req?.body,"erqerer");
    const { name, parentId } = req?.body;
    if (!name || !parentId) {
      return res.status(400).json({ message: 'Name and parentId are required' });
    }
    const childNode = await NodeModel.create({
      name,
      parent: parentId
    });
    await NodeModel.findByIdAndUpdate(parentId, {
      $push: { children: childNode._id }
    });
    res.status(201).json({
      message: 'Child node created successfully',
      data: childNode
    });
    } catch (err) {
      console.log(err, "error in creating child node");
      next(err);
    }
  };

  async EditNodeLabel  (req, res, next){
    try { 
      const { id, newLabel } = req.body;
        console.log(req?.body,"erqerer");
      if (!id || !newLabel) {
        return res.status(400).json({ message: 'ID and new label are required' });
      }
      const updatedNode = await NodeModel.findByIdAndUpdate(id, { name: newLabel }, { new: true });
      if (!updatedNode) {
        return res.status(404).json({ message: 'Node not found' });
      }
      res.status(200).json({ message: 'Node label updated successfully', data: updatedNode });    
  
    }catch (err) {
      console.log(err, "error in creating child node");
      next(err);
    }
  }
  

  async deleteNode(req, res, next) {
    try {
      console.log(req.params, "params");
    const { id } = req?.params;

    const node = await NodeModel.findById(id);
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    await deleteNodeRecursively(id);

 
    if (node.parent) {
      await NodeModel.findByIdAndUpdate(node.parent, {
        $pull: { children: node._id }
      });
    }

    res.status(200).json({ message: 'Node and its descendants deleted successfully' });
  } catch (err) {
    next(err);
  }
  };

}

module.exports = new ItemController();