import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchData } from '../../helpers/axiosHelper';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

export const Sponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const { token } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        const response = await fetchData('/sponsorships/get', 'GET', null, {
          Authorization: `Bearer ${token}`,
        });

        if (response.status === 200) {
          setSponsorships(response.data);
        }
      } catch (error) {
        console.error('Error al obtener las suscripciones:', error);
        toast.error(t('error_fetching_subscriptions'));
      }
    };

    fetchSponsorships();
  }, [token, t]);

  const handleSponsorshipDeletion = async (sponsorshipId) => {
    try {
      await fetchData(`/sponsorships/cancel/${sponsorshipId}`, 'DELETE', null, {
        Authorization: `Bearer ${token}`,
      });
      toast.success(t('sponsorship_deleted_successfully'));
      setSponsorships((prevSponsorships) =>
        prevSponsorships.filter((sponsorship) => {
          if (sponsorship.sponsorship_id === sponsorshipId) {
            sponsorship.is_deleted = 1;
          }
          return sponsorship;
        })
      );
    } catch (error) {
      console.error('Error al eliminar la suscripción:', error);
      toast.error(t('error_deleting_subscription'));
    }
  };

  return (
    <div className="admin-table">
      <div className="container">
        <h3>{t('subscriptions')}</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('beehive_name')}</th>
                <th>{t('subscription_type')}</th>
                <th>{t('start_date')}</th>
                <th>{t('user_name')}</th>
                <th>{t('status')}</th>
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((sponsorship) => (
                <tr key={sponsorship.sponsorship_id}>
                  <td>{sponsorship.sponsorship_id}</td>
                  <td>{sponsorship.beehive_name}</td>
                  <td>{sponsorship.sponsorship_type}</td>
                  <td>{sponsorship.start_date}</td>
                  <td>{sponsorship.user_name}</td>
                  <td>
                    {sponsorship.is_deleted ? t('inactive') : t('active')}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleSponsorshipDeletion(sponsorship.sponsorship_id)
                      }
                      disabled={sponsorship.is_deleted}
                      style={
                        sponsorship.is_deleted
                          ? { backgroundColor: 'gray', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
