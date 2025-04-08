import { Link } from 'react-router-dom';
import './styles.css';

export const AdminHome = () => {
  return (
    <div className="admin-home">
      <div className="grid-container">
        {[
          { path: '/productos', label: 'Productos' },
          { path: '/usuarios', label: 'Usuarios' },
          { path: '/categorias', label: 'Categorías' },
          { path: '/suscripciones', label: 'Suscripciones' },
          { path: '/colmenas', label: 'Colmenas' },
          { path: '/ventas', label: 'Ventas' },
        ].map(({ path, label }) => (
          <Link key={path} to={path} className="grid-item">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};
