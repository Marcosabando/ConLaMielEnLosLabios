import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './styles.css';
import { toast } from 'react-toastify';
import { fetchData } from '../../helpers/axiosHelper';
import { useTranslation } from 'react-i18next';

export const SponsorColmenaType = () => {
  const [subscription, setSubscription] = useState(null);
  const { id } = useParams();
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetchData(`/sponsorships/types/${id}`, 'GET');

        if (response.data.length === 0) {
          navigate('/', { replace: true });
          return;
        }

        const benefits = await fetchData(`/sponsorships/benefits/${id}`, 'GET');

        const suscription = response.data[0];
        suscription.benefits = benefits.data;

        setSubscription(suscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error(t('error_fetching_plan'));
      }
    };

    fetchSubscription();
  }, [id, navigate, t]);

  const handlePayment = async () => {
    if (!user) {
      toast.error(t('you_must_be_logged_in_to_pay'));
      return;
    }

    try {
      const items = [
        {
          title: subscription.title,
          price: subscription.price,
          quantity: 1,
          sponsorship_type_id: subscription.sponsorship_type_id,
          isSubscription: true,
        },
      ];

      const response = await fetch('http://localhost:4000/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          email: user?.email || 'cliente@email.com',
          userId: localStorage.getItem('userId'),
          type: 'subscription',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar el pago');
      }

      const { url } = await response.json();

      window.location.href = url;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error(t('payment_error'));
    }
  };

  if (!subscription) return null;

  return (
    <div className="sponsor-container">
      <div className="plan-info">
        <h2>{subscription.title}</h2>
        <p>{subscription.description}</p>
        <div className="benefits-container">
          {subscription.benefits?.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <span>🐝</span>
              <p>{benefit.benefit_text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="separator"></div>

      <div className="payment-section">
        <p>{t('assigned_beehive_info')}</p>
        <div className="payment-footer">
          <span className="price">${subscription.price}</span>
          <button className="sponsor-button" onClick={handlePayment}>
            {t('sponsor_now')}
          </button>
        </div>
      </div>
    </div>
  );
};
