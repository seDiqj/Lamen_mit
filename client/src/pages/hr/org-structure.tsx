import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, ChevronDown, ChevronRight, User, List, GitBranch } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface PositionType {
  id: string;
  title: string;
  code: string;
  departmentId?: string;
  parentPositionId?: string;
  grade?: string;
  department?: Department;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeCode: string;
  departmentId?: string;
  positionId?: string;
  employmentStatus: string;
  department?: Department;
  position?: PositionType;
}

function DepartmentNode({ 
  department, 
  employees, 
  positions 
}: { 
  department: Department; 
  employees: Employee[]; 
  positions: PositionType[];
}) {
  const [expanded, setExpanded] = useState(true);
  
  const deptEmployees = employees.filter(e => e.departmentId === department.id);
  const deptPositions = positions.filter(p => p.departmentId === department.id);

  const employeesByPosition = deptPositions.map(pos => ({
    position: pos,
    employees: deptEmployees.filter(e => e.positionId === pos.id)
  }));

  const unassignedEmployees = deptEmployees.filter(
    e => !e.positionId || !deptPositions.find(p => p.id === e.positionId)
  );

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between gap-2 pb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{department.name}</CardTitle>
          <Badge variant="secondary">{department.code}</Badge>
        </div>
        <Badge>{deptEmployees.length} employees</Badge>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0">
          {department.description && (
            <p className="text-sm text-muted-foreground mb-4">{department.description}</p>
          )}
          
          <div className="space-y-4">
            {employeesByPosition.map(({ position, employees: posEmployees }) => (
              <div key={position.id} className="ml-4 border-l-2 border-muted pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{position.title}</span>
                  {position.grade && (
                    <Badge variant="outline" className="text-xs">Grade: {position.grade}</Badge>
                  )}
                </div>
                
                {posEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {posEmployees.map(emp => (
                      <div 
                        key={emp.id} 
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-muted-foreground">{emp.employeeCode}</p>
                        </div>
                        <Badge 
                          variant={emp.employmentStatus === "active" ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {emp.employmentStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No employees assigned</p>
                )}
              </div>
            ))}

            {unassignedEmployees.length > 0 && (
              <div className="ml-4 border-l-2 border-dashed border-muted pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-muted-foreground">Unassigned Position</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {unassignedEmployees.map(emp => (
                    <div 
                      key={emp.id} 
                      className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-muted-foreground">{emp.employeeCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deptPositions.length === 0 && deptEmployees.length === 0 && (
              <p className="text-sm text-muted-foreground italic ml-4">
                No positions or employees in this department
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

const CompanyNode = ({ data }: { data: { label: string } }) => (
  <div className="px-6 py-4 shadow-lg rounded-lg bg-primary text-primary-foreground border-2 border-primary min-w-[200px] text-center">
    <div className="font-bold text-lg">{data.label}</div>
  </div>
);

const DepartmentFlowNode = ({ data }: { data: { label: string; code: string; count: number } }) => (
  <div className="px-4 py-3 shadow-md rounded-lg bg-card border-2 border-primary/50 min-w-[160px]">
    <div className="flex items-center gap-2 mb-1">
      <Building2 className="h-4 w-4 text-primary" />
      <span className="font-semibold text-sm">{data.label}</span>
    </div>
    <div className="flex items-center justify-between">
      <Badge variant="secondary" className="text-xs">{data.code}</Badge>
      <span className="text-xs text-muted-foreground">{data.count} staff</span>
    </div>
  </div>
);

const PositionFlowNode = ({ data }: { data: { label: string; grade?: string; department?: string; employees: { name: string; code: string }[] } }) => (
  <div className="px-3 py-2 shadow-sm rounded-md bg-muted/80 border border-border min-w-[140px]">
    <div className="font-medium text-sm text-center mb-1">{data.label}</div>
    {data.department && (
      <Badge variant="outline" className="text-xs mb-1 w-full justify-center">{data.department}</Badge>
    )}
    {data.grade && (
      <div className="text-xs text-muted-foreground text-center mb-2">Grade: {data.grade}</div>
    )}
    {data.employees.length > 0 && (
      <div className="space-y-1 pt-1 border-t border-border">
        {data.employees.slice(0, 3).map((emp, i) => (
          <div key={i} className="flex items-center gap-1 text-xs">
            <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-2 w-2 text-primary" />
            </div>
            <span className="truncate">{emp.name}</span>
          </div>
        ))}
        {data.employees.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{data.employees.length - 3} more
          </div>
        )}
      </div>
    )}
  </div>
);

const nodeTypes = {
  company: CompanyNode,
  department: DepartmentFlowNode,
  position: PositionFlowNode,
};

function HierarchyTreeView({ 
  departments, 
  positions, 
  employees 
}: { 
  departments: Department[]; 
  positions: PositionType[]; 
  employees: Employee[];
}) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    nodes.push({
      id: "company",
      type: "company",
      data: { label: "Lamen Microfinance Institution" },
      position: { x: 400, y: 0 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    });
    
    const topLevelPositions = positions.filter(p => !p.parentPositionId);
    
    const getChildPositions = (parentId: string): PositionType[] => {
      return positions.filter(p => p.parentPositionId === parentId);
    };
    
    const getPositionLevel = (pos: PositionType, visited = new Set<string>()): number => {
      if (visited.has(pos.id)) return 0;
      visited.add(pos.id);
      if (!pos.parentPositionId) return 0;
      const parent = positions.find(p => p.id === pos.parentPositionId);
      if (!parent) return 0;
      return 1 + getPositionLevel(parent, visited);
    };
    
    const positionsByLevel: Map<number, PositionType[]> = new Map();
    positions.forEach(pos => {
      const level = getPositionLevel(pos);
      if (!positionsByLevel.has(level)) {
        positionsByLevel.set(level, []);
      }
      positionsByLevel.get(level)!.push(pos);
    });
    
    const maxLevel = Math.max(...Array.from(positionsByLevel.keys()), 0);
    
    const positionNodes: Map<string, { x: number; y: number }> = new Map();
    
    const addPositionNodes = (
      positionsList: PositionType[], 
      level: number, 
      baseX: number,
      spreadWidth: number
    ) => {
      if (positionsList.length === 0) return;
      
      const posSpacing = Math.min(220, spreadWidth / Math.max(positionsList.length, 1));
      const posTotalWidth = (positionsList.length - 1) * posSpacing;
      const posStartX = baseX - posTotalWidth / 2;
      const yPos = 100 + level * 140;
      
      positionsList.forEach((pos, posIndex) => {
        const posEmployees = employees
          .filter(e => e.positionId === pos.id)
          .map(e => ({ name: `${e.firstName} ${e.lastName}`, code: e.employeeCode }));
        
        const posX = posStartX + posIndex * posSpacing;
        
        positionNodes.set(pos.id, { x: posX, y: yPos });
        
        const dept = departments.find(d => d.id === pos.departmentId);
        
        nodes.push({
          id: `pos-${pos.id}`,
          type: "position",
          data: { 
            label: pos.title, 
            grade: pos.grade,
            department: dept?.name,
            employees: posEmployees 
          },
          position: { x: posX, y: yPos },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
        
        const sourceId = pos.parentPositionId ? `pos-${pos.parentPositionId}` : "company";
        edges.push({
          id: `e-${sourceId}-pos-${pos.id}`,
          source: sourceId,
          target: `pos-${pos.id}`,
          type: "smoothstep",
          style: { 
            stroke: pos.parentPositionId ? "hsl(var(--muted-foreground))" : "hsl(var(--primary))", 
            strokeWidth: pos.parentPositionId ? 1.5 : 2 
          },
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: pos.parentPositionId ? "hsl(var(--muted-foreground))" : "hsl(var(--primary))" 
          },
        });
        
        const children = getChildPositions(pos.id);
        if (children.length > 0) {
          addPositionNodes(children, level + 1, posX, posSpacing * 0.9);
        }
      });
    };
    
    const totalWidth = Math.max(800, topLevelPositions.length * 250);
    addPositionNodes(topLevelPositions, 1, 400, totalWidth);
    
    return { nodes, edges };
  }, [departments, positions, employees]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Departments Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create departments to build your organizational structure
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full bg-background rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="hsl(var(--muted-foreground))" gap={20} size={1} />
        <Controls className="bg-card border rounded-md" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === "company") return "hsl(var(--primary))";
            if (node.type === "department") return "hsl(var(--primary) / 0.5)";
            return "hsl(var(--muted))";
          }}
          className="bg-card border rounded-md"
        />
      </ReactFlow>
    </div>
  );
}

function ListView({ 
  departments, 
  positions, 
  employees 
}: { 
  departments: Department[]; 
  positions: PositionType[]; 
  employees: Employee[];
}) {
  const unassignedEmployees = employees.filter(
    e => !e.departmentId || !departments.find(d => d.id === e.departmentId)
  );

  return (
    <div className="space-y-4">
      {departments.map(dept => (
        <DepartmentNode
          key={dept.id}
          department={dept}
          employees={employees}
          positions={positions}
        />
      ))}

      {unassignedEmployees.length > 0 && (
        <Card className="border-l-4 border-l-muted">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg text-muted-foreground">
                Unassigned to Department
              </CardTitle>
              <Badge variant="secondary">{unassignedEmployees.length} employees</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {unassignedEmployees.map(emp => (
                <div 
                  key={emp.id} 
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                >
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-muted-foreground">{emp.employeeCode}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {departments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Departments Yet</h3>
            <p className="text-sm text-muted-foreground">
              Create departments to build your organizational structure
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function OrgStructure() {
  const { data: departments = [], isLoading: loadingDepts } = useQuery<Department[]>({
    queryKey: ["/api/hr/departments"],
  });

  const { data: positions = [], isLoading: loadingPos } = useQuery<PositionType[]>({
    queryKey: ["/api/hr/positions"],
  });

  const { data: employees = [], isLoading: loadingEmps } = useQuery<Employee[]>({
    queryKey: ["/api/hr/employees"],
  });

  const isLoading = loadingDepts || loadingPos || loadingEmps;
  const totalActive = employees.filter(e => e.employmentStatus === "active").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organizational Structure</h1>
          <p className="text-sm text-muted-foreground">
            View the company hierarchy by departments and positions
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{departments.length}</p>
            <p className="text-xs text-muted-foreground">Departments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{positions.length}</p>
            <p className="text-xs text-muted-foreground">Positions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active Staff</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading organizational structure...</div>
        </div>
      ) : (
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tree" className="flex items-center gap-2" data-testid="tab-tree-view">
              <GitBranch className="h-4 w-4" />
              Hierarchy Tree
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2" data-testid="tab-list-view">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree">
            <HierarchyTreeView 
              departments={departments} 
              positions={positions} 
              employees={employees} 
            />
          </TabsContent>
          
          <TabsContent value="list">
            <ListView 
              departments={departments} 
              positions={positions} 
              employees={employees} 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
