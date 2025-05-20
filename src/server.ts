import app from './app';
// import { connectDB } from '@/config/database';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
})(); 