const swiper = new Swiper('.reviews-slider', {
    // Optional parameters
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 9000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
  
    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    navigation: {
        nextEl: ".fa-angle-right",
        prevEl: ".fa-angle-left",
    },
  });



const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".categories-box").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of categories that can fit in the carousel at once
let categoriesPerView = Math.floor(carousel.offsetWidth / firstCardWidth);

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const totalCategories = document.querySelectorAll('.categories-box').length;
    const maxScrollLeft = (totalCategories - categoriesPerView) * firstCardWidth;

    if (btn.id == "left") {
      carousel.scrollLeft = Math.max(carousel.scrollLeft - firstCardWidth, 0);
    } else {
      carousel.scrollLeft = Math.min(carousel.scrollLeft + firstCardWidth, maxScrollLeft);
    }
  });
});

// Function to update visibility of navigation buttons
const updateNavButtons = () => {
  const totalCategories = document.querySelectorAll('.categories-box').length;
  const maxScrollLeft = (totalCategories - categoriesPerView) * firstCardWidth;

  document.getElementById('left').style.display = carousel.scrollLeft > 0 ? 'block' : 'none';
  document.getElementById('right').style.display = carousel.scrollLeft < maxScrollLeft ? 'block' : 'none';
};

// Scroll event listener
carousel.addEventListener("scroll", () => {
  updateNavButtons();
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
});

// Initial visibility of navigation buttons
updateNavButtons();




let iconCart = document.querySelector('.shopping');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function(){
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
})
close.addEventListener('click', function (){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
})


let products = null;
// get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

//show datas product in list 
function addDataToHTML(){
    // remove datas default from HTML
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    // add new datas
    if(products != null) // if has data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button onclick="addCart(${product.id})">Add To Cart</button>`;

            listProductHTML.appendChild(newProduct);

        });
    }
}
//use cookie so the cart doesn't get lost on refresh page


let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));
    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML(){
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}/plate </div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        })
    }
    totalHTML.innerText = totalQuantity;
}
function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHTML();
}

function addDataToHTML(){
  let productsContainer = document.querySelector('.products-container');
  productsContainer.innerHTML = '';

  // add new datas
  if(products != null)
  {
      products.forEach(product => {
          let newBox = document.createElement('div');
          newBox.classList.add('box');
          newBox.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <span>${product.type}</span>
              <h2>${product.name}<br>${product.description}</h2>
              <h3 class="price">$${product.price.toFixed(2)}<span>/plate</span></h3>
              <i class='bx bx-cart' onclick="addCart(${product.id})"></i>
              <i class='bx bx-heart'></i>
          `;
          
          if (product.discount) {
              let discountSpan = document.createElement('span');
              discountSpan.classList.add('discount');
              discountSpan.textContent = `-${product.discount}%`;
              newBox.appendChild(discountSpan);
          }

          productsContainer.appendChild(newBox);
      });
  }
}