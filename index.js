const input = document.querySelector("input");
const ul = document.querySelector("ul");
const button = document.querySelector("button");
let currentPage = 1;
let perPage = 12;
let find = "";
const apiKey = `43120738-5c40ac738bb9cceb9c8b4f8fd`;

input.addEventListener("input", _.debounce(handleInput, 500));
button.addEventListener("click", () => {
  perPage += 3;
  fetchImages();
});

function handleInput() {
  const inpValue = input.value;

  if (inpValue === "") {
    clearResults();
    return;
  }

  find = inpValue;
  clearResults();
  fetchImages();
  input.value = "";
}

const loadedImageIds = []; 

async function fetchImages() {
  const nameUrl = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${find}&page=${currentPage}&per_page=${perPage}&key=${apiKey}`;

  try {
    const response = await fetch(nameUrl);
    const data = await response.json();

    if (data.hits.length === 0) {
        ul.innerHTML = "<li>No images found.</li>";
        return;
      }

    data.hits.forEach((hit) => {
      if (!loadedImageIds.includes(hit.id)) { 
        createPic(hit);
        loadedImageIds.push(hit.id); 
      }
    });
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

function createPic(hit) {
  const cardEl = document.createElement("li");
  cardEl.innerHTML = `
    <div class="photo-card">
      <img src="${hit.previewURL}" alt="${hit.tags}" />
      <div class="stats">
        <p class="stats-item"><i class="material-icons">thumb_up</i> ${hit.likes}</p>
        <p class="stats-item"><i class="material-icons">visibility</i> ${hit.views}</p>
        <p class="stats-item"><i class="material-icons">comment</i> ${hit.comments}</p>
        <p class="stats-item"><i class="material-icons">cloud_download</i> ${hit.downloads}</p>
      </div>
    </div>
  `;
  ul.appendChild(cardEl);
}

function clearResults() {
  ul.innerHTML = "";
}
