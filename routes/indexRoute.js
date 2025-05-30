function getRoutes(app) {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        method: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
        path: middleware.route.path
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            method: Object.keys(handler.route.methods).join(', ').toUpperCase(),
            path: handler.route.path
          });
        }
      });
    }
  });
  return routes;
}

function renderRoutesPage(app, client_url) {
  const routes = getRoutes(app);
  const routesHtml = routes.map(r => `
    <tr>
      <td style="padding: 10px; border: 1px solid #555;">${r.method}</td>
      <td style="padding: 10px; border: 1px solid #555;"><code>${r.path}</code></td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <title>Projet React M2</title>
        <style>
          body {
            background-color: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            padding: 30px;
          }
          a {
            color: #00d8ff;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            border: 2px solid #00d8ff;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
          }
          a:hover {
            background-color: #00d8ff;
            color: #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 40px;
          }
          th, td {
            border: 1px solid #555;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #111;
          }
          code {
            background: #333;
            padding: 2px 6px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>API Projet react M2</h1>
        <p>API d'une application de gestion académique. Ce projet est réalisé par avotra-saotra-serge-tafita-zoulfikar.</p>
        <a href="${client_url}">Accéder au client</a>
        <h2 style="margin-top:40px;">Routes disponibles :</h2>
        <table>
          <thead>
            <tr>
              <th>Méthode</th>
              <th>Chemin</th>
            </tr>
          </thead>
          <tbody>
            ${routesHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

module.exports = renderRoutesPage;