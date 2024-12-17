// frontend/src/features/users/components/UseDashboard.tsx
import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { pencil, person, heart, albums } from 'ionicons/icons';
import styles from '../styles/UserDashboard.module.css';
import { useAuth } from '../../../app/providers/AuthProvider';
import { userService } from '../../../services/user.service';
import Layout from '../../../components/layout/Layout';

interface Favorite {
  id: number;
  text: string;
  author: string;
}

interface EditRequest {
  id: number;
  phrase: string;
  status: string; // "pending", "approved", "rejected"
}

interface UserDetails {
  username: string;
  email: string;
  avatar?: string;
  description?: string;
}

const UserDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await userService.fetchUserDetails();
        const favs = await userService.fetchUserFavorites();
        const requests = await userService.fetchEditRequests();

        setUserDetails(details);
        setFavorites(favs);
        setEditRequests(requests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
<Layout title="Dashboard">
    <div className={styles.dashboardContainer}>
          
      {/* User Info */}
      <IonCard className={styles.userCard}>
        <IonCardHeader>
          <IonAvatar className={styles.avatar}>
            <img src={userDetails?.avatar || '/default-avatar.png'} alt="Avatar" />
          </IonAvatar>
          <IonCardTitle>{userDetails?.username}</IonCardTitle>
          <p className={styles.email}>{userDetails?.email}</p>
          {userDetails?.description && <p className={styles.description}>{userDetails.description}</p>}
        </IonCardHeader>
        <IonCardContent>
          <IonButton onClick={logout} color="danger" expand="block">
            Cerrar Sesión
          </IonButton>
        </IonCardContent>
      </IonCard>

      {/* Favorites */}
      <IonCard className={styles.favoritesCard}>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={heart} /> Favoritos
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {favorites.length > 0 ? (
            <ul className={styles.list}>
              {favorites.map((fav) => (
                <li key={fav.id} className={styles.listItem}>
                  <p>{fav.text}</p>
                  <span>- {fav.author}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes frases favoritas.</p>
          )}
        </IonCardContent>
      </IonCard>

      {/* Edit Requests */}
      <IonCard className={styles.editRequestsCard}>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={pencil} /> Solicitudes de Edición
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {editRequests.length > 0 ? (
            <ul className={styles.list}>
              {editRequests.map((req) => (
                <li key={req.id} className={styles.listItem}>
                  <p>{req.phrase}</p>
                  <span className={styles.status}>{req.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes de edición pendientes.</p>
          )}
        </IonCardContent>
      </IonCard>
     
    </div>
    </Layout>

  );
};

export default UserDashboard;