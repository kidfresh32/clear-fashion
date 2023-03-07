
const fs = require('fs');
const sandboxx = require('./sandboxDed');


// Lit le fichier navLinks.json contenant les liens de la barre de navigation
fs.readFile('navLinksDed.json', (err, data) => {
  if (err) throw err;

  // Convertit le contenu du fichier en un tableau de liens
  const navLinksArray = JSON.parse(data);

  // Boucle sur chaque lien et appelle la fonction sandbox
  navLinksArray.forEach((link => {
    sandboxx.sandbox(link)
        }));
    });
    




