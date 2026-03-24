// api/index.js
// Función serverless — evalfelicidad.sophiamx.org
// Inyecta tokens de Airtable desde variables de entorno de Vercel:
//   QUERY_ID_PARTICIPANTE  → token de LECTURA sobre la tabla Participantes
//   EVALUACION_FELICIDAD   → token de ESCRITURA sobre la tabla Sesiones

const fs   = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const tokenParticipantes = process.env.QUERY_ID_PARTICIPANTE || '';
  const tokenEvaluaciones  = process.env.EVALUACION_FELICIDAD  || '';

  // Leer el slug del URL: /autoconocimiento → autoconocimiento.html
  const rawSlug  = (req.url || '/').replace(/^\//, '').split('?')[0];
  const slug     = rawSlug || 'autoconocimiento';   // raíz → default
  const fileName = slug.endsWith('.html') ? slug : `${slug}.html`;

  // Los HTML están en la raíz del repo (un nivel arriba de /api)
  const filePath = path.join(__dirname, '..', fileName);

  if (!fs.existsSync(filePath)) {
    res.status(404).send(`
      <html><body style="font-family:sans-serif;padding:40px">
        <h2>404 — Módulo no encontrado</h2>
        <p>No existe <strong>${fileName}</strong>.</p>
        <p>Módulos disponibles:
          autoconocimiento, bienestar-emocional, bienestar-fisico,
          presencia-consciente, vinculos-vitales, trabajo-proposito,
          estetica-existencial, fe-filosofia
        </p>
      </body></html>
    `);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Inyectar tokens (reemplaza los placeholders en el HTML)
  html = html.replace('window.__QUERY_ID_PARTICIPANTE__', JSON.stringify(tokenParticipantes));
  html = html.replace('window.__EVALUACION_FELICIDAD__',  JSON.stringify(tokenEvaluaciones));

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');   // nunca cachear — contiene tokens
  res.status(200).send(html);
};
