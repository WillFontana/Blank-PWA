// Função que popula o app
async function buildApplication(domain, url) {
  /*

  Json retorno erro
  https://www.geniuz.com.br/json_pwa_delivery/chefde

  Json OK

  https://www.geniuz.com.br/json_pwa_delivery/arthur-thomas
  https://www.geniuz.com.br/json_pwa_delivery/thebestacai
  https://www.geniuz.com.br/json_pwa_delivery/modelo-restaurante
  https://www.geniuz.com.br/json_pwa_delivery/chefdepaula
  */
  const json = 'json_pwa_delivery';
  try {
    const { data } = await axios.get(`${domain}/${json}/${url}`);
    const { empresa, produtosCatalogo, produtosDestaque, banner } = data;

    if (empresa) {
      let { txnomefantasia } = empresa;
      $('#company_fantasy_name').html(txnomefantasia);
    }

    if (banner) {
      let BannerCardToAdd = '';
      if (('indexedDB' in window)) {
        readAllData('banners').then(async bannersInCache => {
          await compareCaches('banners', bannersInCache, banner, 'cdbanner', 'txfotobanner');
        });
      };
      banner.forEach((element, i) => {
        let { txfotobanner, cdbanner, txbannertumb } = element;
        let img = new Image();
        img.src = `${domain}/${txbannertumb}`;
        BannerCardToAdd += `
        <a pic-load="${txfotobanner}" class="banner-item -loading" id="banner_${cdbanner}" style="background-image: url(${domain}/${txbannertumb});">
        </a>
        `;
      });
      $('.banners-section').append(`
        <div class="banner-row owl-carousel owl-theme">
          ${BannerCardToAdd}
        </div>
      `);
      $('.banner-row').owlCarousel({
        loop: true,
        autoplay: false,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        dots: false,
        responsive: {
          0: {
            items: 1,
            stagePadding: 60,
          },
          1024: {
            stagePadding: 0,
            items: 2
          }
        }
      });
    } else {
      if (('indexedDB' in window)) {
        clearAllStorage('banners');
      };
    }

    if (produtosDestaque) {
      if (('indexedDB' in window)) {
        readAllData('destaques').then(async destaquesInCache => {
          await compareCaches('destaques', destaquesInCache, produtosDestaque, 'cdproduto', 'txprodutofoto');
        });
      };
      let productCardToAdd = '';
      produtosDestaque.forEach(produto => {
        let { cdproduto, txdescricao, txproduto, txprodutofoto, vlproduto, txprodutotumb } = produto;
        let img = new Image();
        img.src = `${domain}/${txprodutotumb}`;
        productCardToAdd += `
          <div class="catalog-item" id="cd_produto-${cdproduto}">
            <div class="item-picture -loading" pic-load="${txprodutofoto}" style="background-image: url(${domain}/${txprodutotumb});"></div>
            <div class="item-info">
              <div class="item-headline">
                <h2 class="product-name">
                  ${txproduto}
                </h2>
                <p class="product-descript">
                  ${txdescricao}
                </p>
              </div>
              <div class="item-pricing">
                <div class="current-pricing">
                  <div class="add-link">
                    <i class="svg-icon -primary-icon">
                      <svg>
                        <use xlink:href="#icon-plus"></use>
                      </svg>
                    </i>
                  </div>
                  <p class="product-value">
                    R$ ${vlproduto}
                  </p>
                </div>
              </div>
            </div>
          </div>
          `;
      });

      $('#feature-section').append(`
      <div class="category-headline">
        <h3 class="title">
          Destaques
        </h3>
      </div>
      <div class="catalog-row owl-carousel owl-theme">
        ${productCardToAdd}
      </div>
      `);
      $('#feature-section .catalog-row').owlCarousel({
        loop: false,
        dots: true,
        autoPlay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        dots: true,
        stagePadding: 0,
        responsive: {
          0: {
            loop: true,
            autoPlay: false,
            items: 2,
            stagePadding: 25
          },
          1024: {
            items: 3,
          }
        }
      });
    } else {
      if (('indexedDB' in window)) {
        clearAllStorage('destaques');
      };
    }

    if (produtosCatalogo) {
      let categories = [];
      let subcategories = [];
      if (('indexedDB' in window)) {
        readAllData('catalogo').then(async catalogoInCache => {
          await compareCaches('catalogo', catalogoInCache, produtosCatalogo, 'cdproduto', 'txprodutofoto');
        });
      };
      produtosCatalogo.forEach(produto => {
        let { txprodutocategoria, txprodutosubcategoria } = produto;
        !categories.includes(txprodutocategoria) && categories.push(txprodutocategoria) && categories.sort();
        !subcategories.includes(txprodutosubcategoria) && subcategories.push(txprodutosubcategoria) && subcategories.sort();
      });

      categories.forEach(category => {
        $('.filter-row').append(`
        <div class="filter-item">
          <p class="text">
            ${category}
          </p>
        </div>
        `);
      });
      subcategories.forEach(subcategory => {
        $('.filter-row').append(`
        <div class="filter-item">
          <p class="text">
            ${subcategory}
          </p>
        </div>
        `);
      });

      for (let i = 0; i < categories.length; i++) {
        $('#catalog-section').append(`
        <div class="category-headline">
          <h3 class="title">
            ${categories[i]}
          </h3>
        </div>
        `);
        for (let j = 0; j < subcategories.length; j++) {
          let arrayCategoryProducts = produtosCatalogo.filter(produto => produto.txprodutocategoria == categories[i] && produto.txprodutosubcategoria == subcategories[j]);
          let productCardToAdd = '';
          arrayCategoryProducts.forEach(produto => {
            let { cdproduto, txdescricao, txproduto, txprodutofoto, vlproduto, txprodutotumb } = produto;
            let img = new Image();
            img.src = `${domain}/${txprodutotumb}`;
            productCardToAdd += `
              <div class="catalog-item" id="cd_produto-${cdproduto}" >
                <div class="item-picture -loading" pic-load="${txprodutofoto}" style="background-image: url(${domain}/${txprodutotumb});"></div>
                <div class="item-info">
                  <div class="item-headline">
                    <h2 class="product-name">
                      ${txproduto}
                    </h2>
                    <p class="product-descript">
                      ${txdescricao}
                    </p>
                  </div>
                  <div class="item-pricing">
                    <div class="current-pricing">
                      <div class="add-link">
                        <i class="svg-icon -primary-icon">
                          <svg>
                            <use xlink:href="#icon-plus"></use>
                          </svg>
                        </i>
                      </div>
                      <p class="product-value">
                        R$ ${vlproduto}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              `;
          });
          if (productCardToAdd) {
            $('#catalog-section').append(`
            <h4 class="sub-head">
              ${subcategories[j]}
            </h4>
            `);
            $('#catalog-section').append(`
            <div class="product-grid">
              ${productCardToAdd}
            </div>
            `);
          }
        }
      }
      $('.filter-row').owlCarousel({
        loop: false,
        nav: false,
        dots: false,
        autoWidth: true,
      });
    } else {
      if (('indexedDB' in window)) {
        clearAllStorage('catalogo');
      };
    }

    if (banner) {
      loadFullQualityImage('.banner-item', domain);
    }

    if (produtosDestaque || produtosCatalogo) {
      loadFullQualityImage('.item-picture', domain);
    }

    setTimeout(() => {
      $('.main-content').removeClass('-loading');
      $('.body-loader').addClass('-fading');
      setTimeout(() => {
        $('.body-loader').addClass('-gone');
      }, 400);
    }, 400);

  } catch (error) {
    console.log(error);
  }

}

function loadFullQualityImage(classItem, domain) {
  try {
    $(`${classItem}`).each(async function () {
      const el = $(this);
      const remLoad = () => {
        setTimeout(() => {
          el.removeClass('-loading');
        }, 300);
      }
      let { url } = await fetch(`${domain}/${$(this).attr('pic-load')}`);
      let fullQualityBG = new Image();
      fullQualityBG.onload = function () {
        el.css('background-image', `url(${this.src})`);
        remLoad();
      };
      fullQualityBG.onabort = remLoad();
      fullQualityBG.onerror = remLoad();

      fullQualityBG.src = url;
    })
  } catch (error) {
    console.log(error);
  }
}
