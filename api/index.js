// api/index.js
// Inyecta tokens de Airtable desde variables de entorno de Vercel:
//   QUERY_ID_PARTICIPANTE  → lectura sobre Participantes
//   EVALUACION_FELICIDAD   → escritura sobre Sesiones

const fs   = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const tokenParticipantes = process.env.QUERY_ID_PARTICIPANTE || '';
  const tokenEvaluaciones  = process.env.EVALUACION_FELICIDAD  || '';

  // Leer slug del URL: / → home.html, /autoconocimiento → autoconocimiento.html
  const rawSlug  = (req.url || '/').replace(/^\//, '').split('?')[0];
  const slug     = rawSlug || 'home';   // raíz → home.html
  const fileName = slug.endsWith('.html') ? slug : `${slug}.html`;
  const filePath = path.join(__dirname, '..', fileName);

  if (!fs.existsSync(filePath)) {
    res.status(404).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#FFFCFA">
        <h2>404 — Módulo no encontrado</h2>
        <p>No existe <strong>${fileName}</strong>.</p>
        <p><a href="/">← Volver al portal</a></p>
      </body></html>
    `);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('window.__QUERY_ID_PARTICIPANTE__', JSON.stringify(tokenParticipantes));
  html = html.replace('window.__EVALUACION_FELICIDAD__',  JSON.stringify(tokenEvaluaciones));

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
};
