module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    tokenParticipantes: process.env.QUERY_ID_PARTICIPANTE || '',
    tokenEvaluaciones:  process.env.EVALUACION_FELICIDAD  || ''
  });
};
