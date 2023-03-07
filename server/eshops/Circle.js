const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.card-wrapper')
    .map((i, element) => {
      const date = Date()  
      const name = $(element).find('.card__heading').text().trim().replace(/\s/g, ' ');
      //const link = $(element).find('.card__heading').attr('href');
      //.replace('/products','https://shop.circlesportswear.com/products');
      const price = parseInt($(element).find('.money').text());
      //const image = $(element).find('.media').attr('srcset').replace('//cdn','https://cdn');
      return {name, price,  date,};
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