// frontend/src/features/roles/components/RoleCrud.tsx
import React, { useState, useEffect } from 'react';
import { IonButton, IonInput } from '@ionic/react';
import { roleService } from '../../../services/role.service';
import styles from './RoleCrud.module.css'; // Importamos correctamente el CSS Module

interface Role {
  id: number;
  roleName: string;
  description: string;
}

const RoleCrud: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editRoleId, setEditRoleId] = useState<number | null>(null);
  const [updatedRole, setUpdatedRole] = useState<Partial<Role>>({});
  const [isNewRoleRow, setIsNewRoleRow] = useState(false);

  const fetchRoles = async () => {
    const data = await roleService.getAllRoles();
    setRoles(data);
  };

  const handleInputChange = (field: keyof Role, value: string) => {
    setUpdatedRole({ ...updatedRole, [field]: value });
  };

  const handleSave = async () => {
    if (isNewRoleRow) {
      await roleService.createRole({
        roleName: updatedRole.roleName!,
        description: updatedRole.description!,
      });
      setIsNewRoleRow(false);
    } else if (editRoleId) {
      await roleService.updateRole(editRoleId, {
        roleName: updatedRole.roleName!,
        description: updatedRole.description!,
      });
    }
    setEditRoleId(null);
    setUpdatedRole({});
    fetchRoles();
  };

  const handleDelete = async (id: number) => {
    await roleService.deleteRole(id);
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestión de Roles</h2>
        <IonButton
          onClick={() => {
            setIsNewRoleRow(true);
            setUpdatedRole({ roleName: '', description: '' });
          }}
          className={styles.addButton}
        >
          Añadir Rol
        </IonButton>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isNewRoleRow && (
              <tr>
                <td>-</td>
                <td>
                  <IonInput
                    value={updatedRole.roleName}
                    onIonChange={(e) => handleInputChange('roleName', e.detail.value!)}
                    className={styles.input}
                  />
                </td>
                <td>
                  <IonInput
                    value={updatedRole.description}
                    onIonChange={(e) => handleInputChange('description', e.detail.value!)}
                    className={styles.input}
                  />
                </td>
                <td>
                  <IonButton onClick={handleSave} className={styles.saveButton}>
                    Guardar
                  </IonButton>
                  <IonButton
                    onClick={() => setIsNewRoleRow(false)}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </IonButton>
                </td>
              </tr>
            )}
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>
                  {editRoleId === role.id ? (
                    <IonInput
                      value={updatedRole.roleName}
                      onIonChange={(e) => handleInputChange('roleName', e.detail.value!)}
                      className={styles.input}
                    />
                  ) : (
                    role.roleName
                  )}
                </td>
                <td>
                  {editRoleId === role.id ? (
                    <IonInput
                      value={updatedRole.description}
                      onIonChange={(e) => handleInputChange('description', e.detail.value!)}
                      className={styles.input}
                    />
                  ) : (
                    role.description
                  )}
                </td>
                <td>
                  {editRoleId === role.id ? (
                    <>
                      <IonButton onClick={handleSave} className={styles.saveButton}>
                        Guardar
                      </IonButton>
                      <IonButton
                        onClick={() => setEditRoleId(null)}
                        className={styles.cancelButton}
                      >
                        Cancelar
                      </IonButton>
                    </>
                  ) : (
                    <>
                      <IonButton
                        onClick={() => {
                          setEditRoleId(role.id);
                          setUpdatedRole(role);
                        }}
                        className={styles.editButton}
                      >
                        Editar
                      </IonButton>
                      <IonButton
                        onClick={() => handleDelete(role.id)}
                        className={styles.deleteButton}
                      >
                        Eliminar
                      </IonButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleCrud;
