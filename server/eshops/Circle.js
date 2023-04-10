const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('#product-grid .grid__item')
    .map((i, element) => {
      const name = $(element).find('.full-unstyled-link').text().trim().split('\n')[0];
      const image = "https:" + $(element).find('img')[0].attribs['src']
      var price = $(element).find('.money').text().split("€");
      price = parseFloat(price[price.length - 1].replace(',', '.'));
      const link =  "https://shop.circlesportswear.com" + $(element)
      .find('.full-unstyled-link').attr("href");
      const brand = "Circle";
      const date = Date()
      return {name, price, link,image,date,brand};
    })
    .get();
};

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