"use client"
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner"
import { useState, useEffect } from "react";
import { TreeManager, type TreeNode } from "@/components/ui/TreeManager";
import { Button } from "@/components/ui/button";
import apis from "@/lib/axios/apiRoutes";
import api from "@/lib/axios/axios";

interface ApiNode {
  _id: string
  name: string
  parent: string | null
  children: ApiNode[]
  isExpanded: boolean
  __v: number
}
export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(false)


  const transformApiData = (apiNodes: ApiNode[]): TreeNode[] => {
    return apiNodes.map(node => ({
      id: node._id,
      name: node.name,
      children: node.children ? transformApiData(node.children) : undefined,
      isExpanded: node?.isExpanded ? node?.isExpanded : false
    }))
  }

  const fetchTreeData = async () => {
    console.log(process.env.DB_HOST);
    setLoading(true)
    try {



      const data = await apis.getTree();

      setTreeData(transformApiData(data))
      if (data) {
        toast("Success", {

          description: "Tree data loaded successfully"
        })
      } else {
        toast("Error", {

          description: "Failed to load tree data from API",

        })
      }
    } catch (error) {

      toast("Error", {

        description: "Failed to load tree data from API",

      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTreeData()
  }, [])

  const transformSingleApiData = (apiNodes: ApiNode): TreeNode => {
    return {
      id: apiNodes._id,
      name: apiNodes.name,
      children: [],
      isExpanded:apiNodes.isExpanded
    }
  }
  const handleAddNode = async (parentId?: string) => {

    if (!parentId) {
      const newLabel = prompt("Enter new label for Header:")
      if (!newLabel) return

      const data = await apis.createParent(newLabel);

      if (data) {
        toast("Success", {

          description: "Tree data reloaded "
        })
      } else {
        toast("Error", { description: "Failed to load tree data from API", })
      }

      fetchTreeData()
    } else {
      const newLabel = prompt("Enter new label for child:")
      if (!newLabel) return
      const data = await apis.createChild(newLabel, parentId);
      console.log("result --->", data.data);

      const newNode = transformSingleApiData(data?.data)
      const addToParent = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            const children = node.children || []
            return {
              ...node,
              children: [...children, newNode]
            }
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) }
          }
          return node
        })
      }
      setTreeData(addToParent(treeData))

      //  fetchTreeData()
    }

  }

  const handleEditNode = async (nodeId: string) => {
    const newLabel = prompt("Enter new label:")
    if (!newLabel) return

    const data = await apis.EditLabel(newLabel, nodeId);
    if (data) {
      fetchTreeData()
      toast("success", { description: data.message, })

    } else {
      toast("Error", { description: "Failed to load tree data from API", })

    }

  }

  const handleDeleteNode = async (nodeId: string) => {

    if (!nodeId) return

    const data = await apis.DeleteNode(nodeId);
    if (data) {
      toast("Deleted", { description: data.message, })
      fetchTreeData()
    }

  }
  const handleToggle = (nodeId: string) => {
      const toggleNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded }
          }
          if (node.children) {
            return { ...node, children: toggleNode(node.children) }
          }
          return node
        })
      }
      
      setTreeData(toggleNode(treeData))
    }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-8">
      <div className="w-full max-w-4xl mx-auto mb-4">
        <Button
          onClick={fetchTreeData}
          disabled={loading}
          className="mb-4"
        >
          {loading ? "Loading..." : "Refresh Tree Data"}
        </Button>
      </div>

      <TreeManager
        data={treeData}
        onAddNode={handleAddNode}
        onEditNode={handleEditNode}
        onDeleteNode={handleDeleteNode}
        handleToggle={handleToggle}
      />
    </div>
  );
}
function transformApiData(data: any): TreeNode {
  throw new Error("Function not implemented.");
}

