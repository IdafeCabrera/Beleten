// frontend/src/features/users/components/UserCrud.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserCrud.module.css';
import { IonButton, IonIcon, IonInput, IonToggle, IonPopover } from '@ionic/react';
import { checkmarkCircle, closeCircle, pencil, trash, add, informationCircle } from 'ionicons/icons';
import { roleService, userService } from '../../../services/user.service';

interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  isActive: boolean;
  password?: string; 
}

interface Role {
  id: number;
  roleName: string;
  description: string;
}

const UserCrud: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [isNewUserRow, setIsNewUserRow] = useState<boolean>(false);
  const [popoverContent, setPopoverContent] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);

 


  

  const fetchUsersAndRoles = async () => {
    try {
      const usersData = await userService.getAllUsers();
      const rolesData = await roleService.getAllRoles(); // Nueva API para roles
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (field: keyof User, value: string | number | boolean) => {
    setUpdatedUser({ ...updatedUser, [field]: value });
  };

  const handleSave = async () => {
    try {
      if (isNewUserRow) {
        await userService.createUser(updatedUser);
        setIsNewUserRow(false);
      } else if (editUserId) {
        await userService.updateUser(editUserId, updatedUser);
      }
      setEditUserId(null);
      setUpdatedUser({});
      fetchUsersAndRoles();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    await userService.deleteUser(id);
    fetchUsersAndRoles();
  };

  const addNewUserRow = () => {
    setIsNewUserRow(true);
    setUpdatedUser({ username: '', email: '', roleId: roles[0]?.id, isActive: true });
  };

  const getRoleName = (roleId: number) => roles.find((role) => role.id === roleId)?.roleName || 'N/A';

  const showRoleDescription = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) setPopoverContent(role.description);
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestión de Usuarios</h2>
        <IonButton onClick={addNewUserRow} color="primary">
          <IonIcon icon={add} slot="start" /> Añadir Usuario
        </IonButton>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isNewUserRow && (
              <tr>
                <td>-</td>
                <td><IonInput value={updatedUser.username} onIonChange={(e) => handleInputChange('username', e.detail.value!)} /></td>
                <td><IonInput value={updatedUser.email} onIonChange={(e) => handleInputChange('email', e.detail.value!)} /></td>
                <td>
  <select
    value={updatedUser.roleId}
    onChange={(e) => handleInputChange('roleId', Number(e.target.value))}
  >
    {roles.map((role) => (
      <option key={role.id} value={role.id}>
        {role.roleName}
      </option>
    ))}
  </select>
</td>

                <td><IonToggle checked={updatedUser.isActive} onIonChange={(e) => handleInputChange('isActive', e.detail.checked)} /></td>
                <td>
                  <IonButton onClick={handleSave} color="success">Guardar</IonButton>
                  <IonButton onClick={() => setIsNewUserRow(false)} color="light">Cancelar</IonButton>
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{editUserId === user.id ? <IonInput value={updatedUser.username} onIonChange={(e) => handleInputChange('username', e.detail.value!)} /> : user.username}</td>
                <td>{editUserId === user.id ? <IonInput value={updatedUser.email} onIonChange={(e) => handleInputChange('email', e.detail.value!)} /> : user.email}</td>
                <td>{editUserId === user.id ? <IonInput type="password" value={updatedUser.password} onIonChange={(e) => handleInputChange('password', e.detail.value!)} /> : user.password}</td>
                <td>
                  {editUserId === user.id ? (
                    <select value={updatedUser.roleId} onChange={(e) => handleInputChange('roleId', Number(e.target.value))}>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.roleName}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {getRoleName(user.roleId)}{' '}
                      <IonButton fill="clear" size="small" onClick={() => showRoleDescription(user.roleId)}>
                        <IonIcon icon={informationCircle} />
                      </IonButton>
                    </>
                  )}
                </td>
                <td>{user.isActive ? 'Sí' : 'No'}</td>
                <td>
                  {editUserId === user.id ? (
                    <>
                      <IonButton onClick={handleSave} color="success">Guardar</IonButton>
                      <IonButton onClick={() => setEditUserId(null)} color="light">Cancelar</IonButton>
                    </>
                  ) : (
                    <>
                      <IonButton onClick={() => { setEditUserId(user.id); setUpdatedUser(user); }} color="warning">
                        <IonIcon icon={pencil} />
                      </IonButton>

                      <IonButton onClick={() => handleDelete(user.id)} color="danger">
                        <IonIcon icon={trash} />
                      </IonButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popoverContent && (
        <IonPopover isOpen={!!popoverContent} onDidDismiss={() => setPopoverContent(null)}>
          <div className={styles.popoverContent}>{popoverContent}</div>
        </IonPopover>
      )}
    </div>
  );
};

export default UserCrud;
