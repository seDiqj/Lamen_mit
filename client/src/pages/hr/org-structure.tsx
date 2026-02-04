import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface Position {
  id: string;
  title: string;
  code: string;
  departmentId?: string;
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
  position?: Position;
}

function DepartmentNode({ 
  department, 
  employees, 
  positions 
}: { 
  department: Department; 
  employees: Employee[]; 
  positions: Position[];
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

export default function OrgStructure() {
  const { data: departments = [], isLoading: loadingDepts } = useQuery<Department[]>({
    queryKey: ["/api/hr/departments"],
  });

  const { data: positions = [], isLoading: loadingPos } = useQuery<Position[]>({
    queryKey: ["/api/hr/positions"],
  });

  const { data: employees = [], isLoading: loadingEmps } = useQuery<Employee[]>({
    queryKey: ["/api/hr/employees"],
  });

  const isLoading = loadingDepts || loadingPos || loadingEmps;

  const unassignedEmployees = employees.filter(
    e => !e.departmentId || !departments.find(d => d.id === e.departmentId)
  );

  const totalActive = employees.filter(e => e.employmentStatus === "active").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
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
      ) : departments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Departments Yet</h3>
            <p className="text-sm text-muted-foreground">
              Create departments to build your organizational structure
            </p>
          </CardContent>
        </Card>
      ) : (
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
        </div>
      )}
    </div>
  );
}
