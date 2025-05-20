import app from './app';
// import { connectDB } from '@/config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);

(async () => {
  try {
    // await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor escuchando en el puerto ${PORT} en todas las interfaces`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
})(); 