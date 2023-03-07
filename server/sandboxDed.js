/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/Montlimart');
const circlebrand = require('./eshops/Montlimart');
const fs = require('fs');
const { promisify } = require('util');


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


async function sandbox (eshop = 'dedicated') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    switch(eshop){
      case 'dedicated':
        const dedicatedLinks = require('./navLinksDed.json');
        const dedicatedProducts = [];

        for (let link of dedicatedLinks) {
          const data = await dedicatedbrand.scrape(link);
          dedicatedProducts.push(...data);
        }

        writeToFile('data_dedicated.json', dedicatedProducts);
        console.log(dedicatedProducts);
        break;

      case 'montlimart':
        const montlimartLinks = require('./navLinksMon.json');
        const montlimartProducts = [];

        for (let link of montlimartLinks) {
          const data = await montlimartbrand.scrape(link);
          montlimartProducts.push(...data);
        }

        writeToFile('data_montlimart.json', montlimartProducts);
        console.log(montlimartProducts);
        break;

        case 'circle': //not functional
          const circleLinks = require('./navLinksCir.json');
          const circleProducts = [];
  
          for (let link of circleLinks) {
            const data = await circlebrand.scrape(link);
            circleProducts.push(...data);
          }
  
          writeToFile('data_montlimart.json', circleProducts);
          console.log(circleProducts);
          break;

      default:
          console.log(`Eshop ${eshop} not supported`);
          process.exit(1);
      }


    //const products = await dedicatedbrand.scrape(eshop);
    //writeToFile('dataDedicated.json', products);

    //console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);

/*
fs.readFile('navLinksDed.json', (err, data) => {
  if (err) throw err;

  // Convertit le contenu du fichier en un tableau de liens
  //const navLinksArray = JSON.parse(data);

  // Boucle sur chaque lien et appelle la fonction sandbox
  /*data.forEach((link => {
    
    sandbox(link)
        }));
    });
  } 
  */

