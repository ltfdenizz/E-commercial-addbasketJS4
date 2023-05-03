const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const delBtn = document.querySelector("#del");
const modalİnfo = document.querySelector("#modal-info");
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProduct();
});
function fetchCategories() {
  // veri çekme isteği atma
  fetch("https://api.escuelajs.co/api/v1/categories")
    //   gelen veriyi işleme
    .then((res) => res.json())
    // işlenen veriyi ekrana basma
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        // console.log(category);
        // gelen herbir obje için div oluşturma
        const categoryDiv = document.createElement("div");
        // dive class ekleme
        categoryDiv.classList.add("category");
        // divin içeriğini değiştirme
        categoryDiv.innerHTML = `
        <img src="${category.image}" />
        <span>${category.name}</span>`;
        //    oluşan divi html deki listeye atma
        categoryList.appendChild(categoryDiv);
      })
    );
}

// ürünleri çekme
function fetchProduct() {
  // apiye istek atma
  fetch(" https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    // işlenen veriyi ekrana basma
    .then((data) => {
      data.slice(0, 25).forEach((item) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `<img src="${item.images[0]}" />
        <p>${item.title}</p>
        <p>${item.category.name}.</p>

        <div class="product-action">
          <p>${item.price} $</p>
          <button onclick="addToBasket({id:${item.id},item:'${item.title}',price:'${item.price}',img:'${item.images[0]}',amount:1})">Sepete Ekle</button>
        </div> `;
        // oluşan ürünü htmldeki liste aktar
        productList.appendChild(productDiv);
      });
    });
}
/* Sepet */
let basket = [];

let total = 0;
/* Sepete Ekleme İşlemi */
function addToBasket(product) {
  // Sepette parametre olarak gelen elemanı arar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);
  if (foundItem) {
    // alert("Septte zaten var");
    foundItem.amount++;
  } else {
    basket.push(product);
  }
  // console.log(basket);
}

// açma kapatma
openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  // sepertin içine ürünleri listeleme
  addList();
  // toplam bilgisini güncelleme
  modalİnfo.innerHTML = total;
});
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  modalList.innerHTML = "";
  total = 0;
});
/* eğer dışarıya tıklanırsa kapatma */
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});

// sepete listeleme fonksiyonu
function addList() {
  basket.forEach((product) => {
    const listİtem = document.createElement("div");
    listİtem.classList.add("list-item");
    listİtem.innerHTML = `
    <img src="${product.img}" alt="" />
              <h2>${product.item}</h2>
              <h2 class="price">${product.price}$</h2>
              <p>Miktar:${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id},price:${product.price},amount:${product.amount}})">Sil</button>`;
    modalList.appendChild(listİtem);
    /* Toplam değişkenini güncelleme */
    total += product.price * product.amount;
  });
}
// sepet dizisinden silme metodu
function deleteItem(deletingItem) {
  /* idsi silinecek elemanın ıdsiyle eşit olmayanları al */
  basket = basket.filter((i) => i.id !== deletingItem.id);
  /* silinen elemanın fiyatını totalden çıkarma */
  total -= deletingItem.price * deletingItem.amount;
  modalİnfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});
