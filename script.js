let searchTimeout; // Timeout untuk delay input

const apikey = "YOUR_API_KEY";
const clientkey = "YOUR_CLIENT";
const limit = 50;
const testing = "a";

// URL Async requesting function
function httpGetAsync(theUrl, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

// Callback untuk menampilkan GIF
function displayGifs(responseText) {
  const response = JSON.parse(responseText);
  const gifs = response.results || [];
  const gallery = document.getElementById("gif-gallery");

  gallery.innerHTML = ""; // Kosongkan gallery sebelumnya

  gifs.forEach((gif) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col p-1";

    const link = document.createElement("a");
    link.href = gif.media_formats.gif.url;
    link.target = "_blank"; // Buka di tab baru

    const img = document.createElement("img");
    img.src = gif.media_formats.nanogif.url;
    img.className = "gif-image";
    img.alt = "GIF";

    link.appendChild(img);
    colDiv.appendChild(link);
    gallery.appendChild(colDiv);
  });
}

// Fungsi untuk search GIF
function searchGifs(query) {
  const search_url = `https://tenor.googleapis.com/v2/search?q=${query}&key=${apikey}&client_key=${clientkey}&limit=${limit}`;

  httpGetAsync(search_url, displayGifs);
}

// Handle input dengan delay 1 detik
document.getElementById("search-input").addEventListener("input", () => {
  const query = document.getElementById("search-input").value.trim();

  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    if (query) {
      searchGifs(query);
    } else {
      loadTrendingGifs(); // Tampilkan GIF trending jika input kosong
    }
  }, 1000);
});

// Initial load - trending GIFs
function loadTrendingGifs() {
  const trending_url = `https://tenor.googleapis.com/v2/featured?key=${apikey}&client_key=${clientkey}&limit=${limit}`;
  httpGetAsync(trending_url, displayGifs);
}

loadTrendingGifs();
