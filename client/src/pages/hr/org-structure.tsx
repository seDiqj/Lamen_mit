import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, ChevronDown, ChevronRight, User, List, GitBranch, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

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
  photoUrl?: string;
  department?: Department;
  position?: PositionType;
}

const TREE_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue  
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

function TreeNode({ 
  position, 
  employees, 
  allPositions, 
  allEmployees,
  departments,
  level = 0,
  colorIndex = 0
}: { 
  position: PositionType; 
  employees: Employee[];
  allPositions: PositionType[];
  allEmployees: Employee[];
  departments: Department[];
  level?: number;
  colorIndex?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const childPositions = allPositions.filter(p => p.parentPositionId === position.id);
  const posEmployees = employees.filter(e => e.positionId === position.id);
  const dept = departments.find(d => d.id === position.departmentId);
  const lineColor = TREE_COLORS[colorIndex % TREE_COLORS.length];
  
  return (
    <li className="relative">
      <div 
        className="relative flex flex-col items-center cursor-pointer"
        onClick={() => childPositions.length > 0 && setExpanded(!expanded)}
      >
        <div 
          className="relative z-10 p-3 rounded-lg border-2 bg-card shadow-md min-w-[140px] max-w-[160px] text-center transition-all hover:shadow-lg"
          style={{ borderColor: lineColor }}
        >
          {posEmployees.length > 0 && posEmployees[0].photoUrl && (
            <div className="flex justify-center mb-2">
              <img 
                src={posEmployees[0].photoUrl} 
                alt={`${posEmployees[0].firstName} ${posEmployees[0].lastName}`}
                className="h-12 w-12 rounded-full object-cover border-2"
                style={{ borderColor: lineColor }}
              />
            </div>
          )}
          {posEmployees.length > 0 && !posEmployees[0].photoUrl && (
            <div className="flex justify-center mb-2">
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2"
                style={{ backgroundColor: lineColor, borderColor: lineColor }}
              >
                {posEmployees[0].firstName[0]}{posEmployees[0].lastName[0]}
              </div>
            </div>
          )}
          <div className="font-semibold text-sm">{position.title}</div>
          {posEmployees.length > 0 && (
            <div className="mt-2 pt-2 border-t space-y-1">
              {posEmployees.slice(0, 3).map(emp => (
                <div key={emp.id} className="text-xs text-muted-foreground">
                  {emp.firstName} {emp.lastName}
                </div>
              ))}
              {posEmployees.length > 3 && (
                <div className="text-xs text-muted-foreground">+{posEmployees.length - 3} more</div>
              )}
            </div>
          )}
          {childPositions.length > 0 && (
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold z-20"
              style={{ backgroundColor: lineColor }}
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          )}
        </div>
      </div>
      
      {expanded && childPositions.length > 0 && (
        <ul className="org-tree-children">
          {childPositions.map((child, idx) => (
            <TreeNode 
              key={child.id}
              position={child}
              employees={allEmployees}
              allPositions={allPositions}
              allEmployees={allEmployees}
              departments={departments}
              level={level + 1}
              colorIndex={idx}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function HierarchyTreeView({ 
  departments, 
  positions, 
  employees 
}: { 
  departments: Department[]; 
  positions: PositionType[]; 
  employees: Employee[];
}) {
  const [zoom, setZoom] = useState(0.85);
  const topLevelPositions = useMemo(() => 
    positions.filter(p => !p.parentPositionId),
    [positions]
  );

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));
  const handleResetZoom = () => setZoom(0.85);

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Positions Yet</h3>
        <p className="text-sm text-muted-foreground">
          Create positions to build your organizational structure
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-lg border p-1">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8" data-testid="button-zoom-out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8" data-testid="button-zoom-in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-8 w-8" data-testid="button-zoom-reset">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    <div className="org-tree-container overflow-auto p-4 min-h-[600px]">
      <style>{`
        .org-tree-container {
          background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.3) 100%);
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
        
        .org-tree-inner {
          transform: scale(${zoom});
          transform-origin: top center;
          transition: transform 0.2s ease;
          min-width: max-content;
          padding: 1rem;
        }
        
        .org-tree {
          display: flex;
          justify-content: center;
          padding-top: 20px;
        }
        
        .org-tree ul {
          padding-top: 30px;
          position: relative;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        
        .org-tree li {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 15px 5px 0;
        }
        
        .org-tree-children {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .org-tree-children > li::before,
        .org-tree-children > li::after {
          content: '';
          position: absolute;
          top: 0;
        }
        
        .org-tree-children > li::before {
          left: 50%;
          width: 4px;
          height: 20px;
          background: linear-gradient(180deg, #10b981 0%, #3b82f6 100%);
          border-radius: 2px;
          transform: translateX(-50%);
        }
        
        .org-tree-children > li:first-child::after,
        .org-tree-children > li:last-child::after {
          width: 50%;
          height: 4px;
          top: 0;
          background: linear-gradient(90deg, #10b981, #3b82f6, #f59e0b, #ef4444);
          border-radius: 2px;
        }
        
        .org-tree-children > li:first-child::after {
          left: 50%;
          border-radius: 2px 0 0 2px;
        }
        
        .org-tree-children > li:last-child::after {
          right: 50%;
          border-radius: 0 2px 2px 0;
        }
        
        .org-tree-children > li:only-child::after {
          display: none;
        }
        
        .org-tree-children > li:not(:first-child):not(:last-child)::after {
          width: 100%;
          height: 4px;
          left: 0;
          background: linear-gradient(90deg, #10b981, #3b82f6, #f59e0b, #ef4444);
        }
        
        .org-tree > li::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 4px;
          height: 20px;
          background: linear-gradient(180deg, #10b981, #3b82f6);
          border-radius: 2px;
          transform: translateX(-50%);
        }
      `}</style>
      
      <div className="org-tree-inner">
      <div className="flex flex-col items-center mb-6">
        <div className="p-5 rounded-xl bg-primary text-primary-foreground shadow-lg min-w-[240px] text-center">
          <Building2 className="h-8 w-8 mx-auto mb-2" />
          <div className="font-bold text-xl">Lamen Microfinance Institution</div>
          <div className="text-sm opacity-90 mt-1">{employees.length} Total Employees</div>
        </div>
      </div>
      
      <ul className="org-tree">
        {topLevelPositions.map((pos, idx) => (
          <TreeNode 
            key={pos.id}
            position={pos}
            employees={employees}
            allPositions={positions}
            allEmployees={employees}
            departments={departments}
            level={0}
            colorIndex={idx}
          />
        ))}
      </ul>
      </div>
    </div>
    </div>
  );
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

  const getParentName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = positions.find(p => p.id === parentId);
    return parent?.title;
  };

  const topLevelPositions = deptPositions.filter(p => 
    !p.parentPositionId || !deptPositions.find(dp => dp.id === p.parentPositionId)
  );

  const getChildPositions = (parentId: string): PositionType[] => {
    return deptPositions.filter(p => p.parentPositionId === parentId);
  };

  const renderPositionTree = (pos: PositionType, level: number = 0): JSX.Element => {
    const posEmployees = deptEmployees.filter(e => e.positionId === pos.id);
    const children = getChildPositions(pos.id);
    const parentName = getParentName(pos.parentPositionId);
    
    return (
      <div key={pos.id} className="ml-4 border-l-2 border-primary/30 pl-4" style={{ marginLeft: level > 0 ? '1.5rem' : '1rem' }}>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/10">{pos.title}</Badge>
          {pos.grade && <span className="text-xs text-muted-foreground">({pos.grade})</span>}
          {parentName && <span className="text-xs text-muted-foreground">→ Reports to: {parentName}</span>}
        </div>
        {posEmployees.length > 0 ? (
          <div className="space-y-1 mb-3">
            {posEmployees.map(emp => (
              <div key={emp.id} className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span>{emp.firstName} {emp.lastName}</span>
                <Badge variant="secondary" className="text-xs">{emp.employeeCode}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-3">No employees assigned</p>
        )}
        {children.map(child => renderPositionTree(child, level + 1))}
      </div>
    );
  };

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
          
          <div className="space-y-2">
            {topLevelPositions.map(pos => renderPositionTree(pos))}
            
            {unassignedEmployees.length > 0 && (
              <div className="ml-4 border-l-2 border-muted pl-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-muted">Unassigned</Badge>
                </div>
                <div className="space-y-1">
                  {unassignedEmployees.map(emp => (
                    <div key={emp.id} className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span>{emp.firstName} {emp.lastName}</span>
                      <Badge variant="secondary" className="text-xs">{emp.employeeCode}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topLevelPositions.length === 0 && unassignedEmployees.length === 0 && (
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

export default function OrgStructurePage() {
  const { data: departments = [], isLoading: loadingDepts } = useQuery<Department[]>({
    queryKey: ["/api/hr/departments"],
  });

  const { data: positions = [], isLoading: loadingPositions } = useQuery<PositionType[]>({
    queryKey: ["/api/hr/positions"],
  });

  const { data: employees = [], isLoading: loadingEmployees } = useQuery<Employee[]>({
    queryKey: ["/api/hr/employees"],
  });

  const isLoading = loadingDepts || loadingPositions || loadingEmployees;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Organizational Structure</h1>
          <p className="text-muted-foreground">View your company's organizational hierarchy</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Building2 className="h-4 w-4 mr-1" />
            {departments.length} Departments
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Users className="h-4 w-4 mr-1" />
            {employees.length} Employees
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading organizational structure...
        </div>
      ) : (
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tree" className="flex items-center gap-2" data-testid="tab-hierarchy-tree">
              <GitBranch className="h-4 w-4" />
              Hierarchy Tree
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2" data-testid="tab-list-view">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="mt-6">
            <HierarchyTreeView 
              departments={departments} 
              positions={positions} 
              employees={employees} 
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {departments.length > 0 ? (
                departments.map(dept => (
                  <DepartmentNode 
                    key={dept.id} 
                    department={dept} 
                    employees={employees}
                    positions={positions}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Departments Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Create departments to build your organizational structure
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
