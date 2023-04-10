const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.products-list__block')
    .map((i, element) => {
      const date = Date()  
      const name = $(element).find('.text-reset').text().trim().replace(/\s/g, ' ');
      const link = $(element).find('.text-reset').attr('href');
      const price = parseInt($(element).find('.price').text());
      const image = $(element).find('.w-100').attr('data-full-size-image-url');
      const brand = "Montlimart";
      return {name, price, link,image,date,brand};
      
    })
    .get();
};

/*document.querySelector(All)('.class')*/

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};