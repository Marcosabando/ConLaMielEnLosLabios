import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

export const BeehiveCard = ({ beehive }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: false,
  };

  return (
    <div key={beehive.beehive_id} className="beehive-card">
      <div className="beehive-image">
        {beehive.images.length > 0 ? (
          <Slider {...sliderSettings}>
            {beehive.images.map((image, index) => (
              <div key={index}>
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/images/beehives/${
                    image.image_url
                  }`}
                  alt={`${beehive.name} - imagen ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="no-image">
            <p>{t("no_image")}</p>
          </div>
        )}
      </div>

      <div className="beehive-info">
        <h3>{beehive.name}</h3>
        <p>{beehive.short_description}</p>

        <button
          className="beehive-button"
          onClick={() => navigate(`/colmenas/${beehive.beehive_id}`)}
        >
          {t("view_more")}
        </button>

        <div className="honeycomb-icon">
          <img src="/icons/panal.svg" alt="Colmena Icon" />
        </div>
      </div>
    </div>
  );
};
