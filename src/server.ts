import app from './app';
// import { connectDB } from '@/config/database';

const PORT = parseInt(process.env.PORT || '3030', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT} en todas las interfaces`);
}); 