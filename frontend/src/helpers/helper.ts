import { toast } from 'react-toastify';

export const mostrarErro = (err: Error) => {
  toast(err.message);
};
