"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission, PermissionModule } from "@/type/user";
import { mockPermissionModules } from "@/data/user";

interface PermissionEditorProps {
  selectedPermissions: Permission[];
  onChange: (permissions: Permission[]) => void;
}

export function PermissionEditor({
  selectedPermissions,
  onChange,
}: PermissionEditorProps) {
  const isPermissionSelected = (permissionId: string) => {
    return selectedPermissions.some((p) => p.id === permissionId);
  };

  const isModuleFullySelected = (module: PermissionModule) => {
    return module.permissions.every((p) => isPermissionSelected(p.id));
  };

  const isModulePartiallySelected = (module: PermissionModule) => {
    const selectedCount = module.permissions.filter((p) =>
      isPermissionSelected(p.id)
    ).length;
    return selectedCount > 0 && selectedCount < module.permissions.length;
  };

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permission]);
    } else {
      onChange(selectedPermissions.filter((p) => p.id !== permission.id));
    }
  };

  const handleModuleToggle = (module: PermissionModule, checked: boolean) => {
    if (checked) {
      // Add all permissions from this module
      const newPermissions = [...selectedPermissions];
      module.permissions.forEach((permission) => {
        if (!isPermissionSelected(permission.id)) {
          newPermissions.push(permission);
        }
      });
      onChange(newPermissions);
    } else {
      // Remove all permissions from this module
      onChange(
        selectedPermissions.filter(
          (p) => !module.permissions.some((mp) => mp.id === p.id)
        )
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPermissions = mockPermissionModules.flatMap((m) => m.permissions);
      onChange(allPermissions);
    } else {
      onChange([]);
    }
  };

  const allSelected = mockPermissionModules.every((m) =>
    isModuleFullySelected(m)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all" className="font-semibold">
          Select All Permissions
        </Label>
      </div>

      <div className="grid gap-4">
        {mockPermissionModules.map((module) => (
          <div
            key={module.module}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`module-${module.module}`}
                checked={isModuleFullySelected(module)}
                // @ts-ignore - indeterminate is a valid prop
                data-indeterminate={isModulePartiallySelected(module)}
                className={
                  isModulePartiallySelected(module)
                    ? "data-[state=checked]:bg-primary/50"
                    : ""
                }
                onCheckedChange={(checked) =>
                  handleModuleToggle(module, checked as boolean)
                }
              />
              <Label
                htmlFor={`module-${module.module}`}
                className="text-base font-semibold cursor-pointer"
              >
                {module.module}
              </Label>
              <span className="text-xs text-muted-foreground">
                ({module.permissions.filter((p) => isPermissionSelected(p.id)).length}/
                {module.permissions.length})
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-6">
              {module.permissions.map((permission) => {
                const action = permission.actions[0];
                const actionColors: Record<string, string> = {
                  create: "text-green-600",
                  read: "text-blue-600",
                  update: "text-orange-600",
                  delete: "text-red-600",
                };

                return (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={isPermissionSelected(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionToggle(permission, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={permission.id}
                      className={`text-sm cursor-pointer capitalize ${actionColors[action]}`}
                    >
                      {action}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

