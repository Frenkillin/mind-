export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Errore interno del server';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
