const NodeModel = require('../models/nodeModal.js');

// Recursive function to get children
async function getNodeWithChildren(node) {
  const children = await NodeModel.find({ parent: node._id }).lean();
  
  const childrenWithSub = await Promise.all(
    children.map(child => getNodeWithChildren(child))
  );

  return {
    ...node,
    children: childrenWithSub
  };
}

// Main function to get the full tree starting from all root nodes
async function buildTreeFromRootNodes() {
  const rootNodes = await NodeModel.find({ parent: null }).lean();

  const fullTree = await Promise.all(
    rootNodes.map(root => getNodeWithChildren(root))
  );

  return fullTree;
}
async function deleteNodeRecursively(nodeId) {
  // Get direct children of this node
  const children = await NodeModel.find({ parent: nodeId });

  // Recursively delete each child
  for (const child of children) {
    await deleteNodeRecursively(child._id);
  }

  // Delete the current node
  await NodeModel.findByIdAndDelete(nodeId);
}
module.exports = {
  buildTreeFromRootNodes,
  deleteNodeRecursively
};
