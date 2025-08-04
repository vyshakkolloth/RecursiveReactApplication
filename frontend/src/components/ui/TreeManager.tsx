
import { ChevronRight, ChevronDown, Plus, Edit, Trash2 } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  isExpanded?: boolean
}

interface TreeManagerProps {
  data: TreeNode[]
  onAddNode?: (parentId?: string) => void
  onEditNode?: (nodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  className?: string
}

interface TreeItemProps {
  node: TreeNode
  level: number
  onToggle: (nodeId: string) => void
  onAddNode?: (parentId?: string) => void
  onEditNode?: (nodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
}

const TreeItem: React.FC<TreeItemProps> = ({ 
  node, 
  level, 
  onToggle, 
  onAddNode, 
  onEditNode, 
  onDeleteNode 
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = node.isExpanded

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(node.id)
    }
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddNode?.(node.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditNode?.(node.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteNode?.(node.id)
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={handleToggle}>
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-between py-2 px-4 hover:bg-muted/50 group transition-colors",
            level > 0 && "border-l border-border/30"
          )}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center space-x-3 flex-1">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={!hasChildren}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <div className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-auto p-1 justify-start flex-1 font-medium"
            >
              <Edit className="h-4 w-4 mr-2" />
              {node.name}
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddChild}
              className="h-7 w-7 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {level > 0 && <Separator className="ml-4" />}
        
        <CollapsibleContent className="space-y-0">
          {hasChildren && node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAddNode={onAddNode}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

const TreeManager = React.forwardRef<
  HTMLDivElement,
  TreeManagerProps
>(({ data, onAddNode, onEditNode, onDeleteNode, className }, ref) => {
  const [treeData, setTreeData] = React.useState<TreeNode[]>(data)

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

  const handleAddRoot = () => {
    onAddNode?.()
  }

  React.useEffect(() => {
    setTreeData(data)
  }, [data])

  return (
    <Card 
      ref={ref}
      className={cn(
        "w-full max-w-4xl mx-auto",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Node Tree Manager</CardTitle>
        <p className="text-muted-foreground">Manage your hierarchical data structure with ease</p>
        
        <Button 
          onClick={handleAddRoot}
          className="w-fit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Root Node
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96 overflow-scroll">
          <div className="space-y-0 p-4">
            {treeData.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                onToggle={handleToggle}
                onAddNode={onAddNode}
                onEditNode={onEditNode}
                onDeleteNode={onDeleteNode}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
})

TreeManager.displayName = "TreeManager"

export { TreeManager, type TreeNode }