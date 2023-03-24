// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const brandSelect = document.querySelector('#brand-select');
const selectReasonablyPriced = document.querySelector('#reasonably-select');
const selectRecentlyReleased = document.querySelector('#recently-select');

let recentProducts = 0
let lastReleaseDate = NaN;
let p50 = 0;
let p90 = 0;
let p95 = 0;


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

//

const fetchProducts = async (page = 1, size = 12, brand = '') => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    var result = body.data.result;

    if(reasonablyPriced){
      result = result.filter(product => product.price<50)
    }

    if(recentlyReleased){
      result = result.filter(product => (new Date() - new Date(product.released)) / (1000 * 60 * 60 * 24) < 50);
    }

    if(sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }
    else if(sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }
    else if(sort === "date-asc") {
      result.sort((a, b) => new Date(b.released) - new Date(a.released));
    }
    else if(sort === "date-desc") {
      result.sort((a, b) => new Date(a.released) - new Date(b.released));
    }

    recentProducts = result.filter(product => (new Date() - new Date(product.released)) / (1000 * 60 * 60 * 24) < 50).length;
    lastReleaseDate = result.sort((a, b) => new Date(b.released) - new Date(a.released))[0].released;

    if(result.length > 0)
    {
      p50 = [...result].sort((a, b) => a.price - b.price)[Math.floor(result.length / 2)].price;
      p90 = [...result].sort((a, b) => a.price - b.price)[Math.floor(result.length * 0.9)].price;
      p95 = [...result].sort((a, b) => a.price - b.price)[Math.floor(result.length * 0.95)].price;
    }
    else
    {
      p50 = 0;
      p90 = 0;
      p95 = 0;
    }

    var meta = {
      currentPage: page,
      pageCount: Math.ceil(result.length / size),
      pageSize: size,
      count: result.length
    };

    var result = result.slice((page - 1) * size, page * size);
    
    return {result,meta};

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
      'https://clear-fashion-api.vercel.app/brands'
      );

    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
    }
    else{
      var brands = body.data.result;
      brands.unshift('all')
      renderBrands(brands)
    }

    return body.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price} €</span>
        <span id="${product.uuid}-fav">` + ((JSON.parse(localStorage.getItem("favorites"))||[]).includes(product.uuid)?`<button onclick=deleteFromFavorites("` + product.uuid + `")>❤️</button>`:`<button onclick=addToFavorites("` + product.uuid + `")>🤍</button>`)
        +`</span>
      </div>
    `})
.join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
  const spanNbRecentProducts = document.querySelector('#nbRecentProducts');
  spanNbRecentProducts.innerHTML = recentProducts;
  const spanp50 = document.querySelector('#p50');
  spanp50.innerHTML = p50;
  const spanp90 = document.querySelector('#p90');
  spanp90.innerHTML = p90;
  const spanp95 = document.querySelector('#p95');
  spanp95.innerHTML = p95;
  const spanLastReleasedDate = document.querySelector('#lastReleasedDate');
  spanLastReleasedDate.innerHTML = lastReleaseDate;
};




/**
 * Render brand selector
 * @param  {Array} brands
 */
const renderBrands = brands => {
  const options = brands.map(brand => `<option value="${brand}">${brand}</option>`).join('')

  selectBrand.innerHTML = options;
};


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brand);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value),selectBrand.value,selectReasonablyPriced.checked,selectRecentlyReleased.checked,selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {

  const numberOfPage = parseInt(event.target.value);
  const products = await fetchProducts(numberOfPage,currentPagination.pageSize,selectBrand.value,selectReasonablyPriced.checked,selectRecentlyReleased.checked,selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage,currentPagination.pageSize,event.target.value,selectReasonablyPriced.checked,selectRecentlyReleased.checked,selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


if(selectReasonablyPriced){
selectReasonablyPriced.addEventListener('change',async(event)=>{
  const products = await fetchProducts(currentPagination.currentPage,currentPagination.pageSize,selectBrand.value,event.target.checked,selectRecentlyReleased.checked,selectSort.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})
}

if(selectRecentlyReleased){
  selectRecentlyReleased.addEventListener('change',async(event)=>{
    const products = await fetchProducts(currentPagination.currentPage,currentPagination.pageSize,selectBrand.value,selectReasonablyPriced.checked,event.target.checked,selectSort.value);
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  })
  }

  selectSort.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage,currentPagination.pageSize,selectBrand.value,selectReasonablyPriced.checked,selectRecentlyReleased.checked,event.target.value);
  
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
  });
  


document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


fetchBrands();


// Add item to favorites
function addToFavorites(id) {
  // Get existing favorites or create empty array
  var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  // Add item to favorites array if not already present
  if (!favorites.includes(id)) {
    favorites.push(id);
    console.log(favorites)
    localStorage.setItem('favorites', JSON.stringify(favorites));
    document.getElementById(id + "-fav").innerHTML = ` <button onclick=deleteFromFavorites("` + id + `")>❤️</button>`;
  }
}

// Add item to favorites
function deleteFromFavorites(id) {
  // Get existing favorites or create empty array
  var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  // Add item to favorites array if not already present

  favorites = favorites.filter(favorite => favorite != id);
  console.log(favorites)
  localStorage.setItem('favorites', JSON.stringify(favorites));
  document.getElementById(id + "-fav").innerHTML = ` <button onclick=addToFavorites("` + id + `")>🤍</button>`;

}