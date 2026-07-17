import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CategoryLegacyRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/products?categoryId=${id}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [id, navigate]);

  return null;
};
