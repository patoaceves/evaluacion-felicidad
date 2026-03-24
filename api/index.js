// api/index.js
// Función serverless del proyecto "evaluaciones" en Vercel.
// Inyecta dos tokens:
//   QUERY_ID_PARTICIPANTE  → acceso a la base de Participantes (lookup)
//   EVALUACION_FELICIDAD   → acceso a la base de Sesiones (guardar resultados)

const fs   = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const tokenParticipantes = process.env.QUERY_ID_PARTICIPANTE || '';
  const tokenEvaluaciones  = process.env.EVALUACION_FELICIDAD  || '';

  const slug     = (req.url || '/').replace(/^\//, '').split('?')[0] || 'autoconocimiento';
  const fileName = slug.endsWith('.html') ? slug : `${slug}.html`;
  const filePath = path.join(__dirname, '..', fileName);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('Página no encontrada');
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('window.__QUERY_ID_PARTICIPANTE__', JSON.stringify(tokenParticipantes));
  html = html.replace('window.__EVALUACION_FELICIDAD__',  JSON.stringify(tokenEvaluaciones));

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
