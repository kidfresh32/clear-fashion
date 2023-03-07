/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/Circle');
const fs = require('fs');

function writeToFile(filename, data) {
  const serializedData = JSON.stringify(data, null, 2);

  // Si le fichier existe déjà, ajoute les nouvelles données à la fin du fichier
  if (fs.existsSync(filename)) {
    fs.appendFileSync(filename, `${serializedData}\n`);
  }
  // Sinon, crée un nouveau fichier et y écrit les données
  else {
    fs.writeFileSync(filename, serializedData);
  }
}

async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/all') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);
    writeToFile('dataCircle.json', products);

    //console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
