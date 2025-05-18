
const mainMenu = ["Ispirati", "Realizza", "Contattami"];
const subMenus = {
  "Ispirati": ["Ascolta", "Gioca", "Proiettati", "Leggi", "Osserva"],
  "Realizza": ["Fotografa", "Segna", "Registra", "Progetta"]
};

let currentMenu = "main";
let currentList = [...mainMenu];
let selectedIndex = 0;
let menuStack = [];

const menuList = document.getElementById("menu-list");
const description = document.getElementById("menu-description");
const title = document.getElementById("menu-title");
const contentArea = document.getElementById("content-area");

function renderMenu() {
  const rightPane = document.querySelector('.menu-right');
  if (currentMenu === "main" && (currentList[selectedIndex] === "Ispirati" || currentList[selectedIndex] === "Realizza")) {
    rightPane.classList.add("hidden");
  } else {
    rightPane.classList.remove("hidden");
  }

  menuList.innerHTML = "";
  currentList.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    if (index === selectedIndex) {
      li.classList.add("selected");
    }
    menuList.appendChild(li);
  });
  title.textContent = currentMenu === "main" ? "Unscripted" : currentMenu;
  showLogo(currentList[selectedIndex]);
}

function showLogo(name) {
  const fileName = name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ /g, "") + ".png";
  if (name === "Ispirati" || name === "Realizza") {
    description.innerHTML = "";
  } else {
    description.innerHTML = `<img src="loghi/${fileName}" class="logo-image kenburns" alt="${name}" />`;
  }
}

function next() {
  selectedIndex = (selectedIndex + 1) % currentList.length;
  renderMenu();
}

function previous() {
  selectedIndex = (selectedIndex - 1 + currentList.length) % currentList.length;
  renderMenu();
}

function confirm() {
  const selected = currentList[selectedIndex];
  if (subMenus[selected]) {
    menuStack.push({ currentMenu, currentList, selectedIndex });
    currentMenu = selected;
    currentList = subMenus[selected];
    selectedIndex = 0;
    renderMenu();
  } else {
    const fileKey = selected.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ /g, "");
    window.location.href = fileKey + ".html";
  }
}

function goHome() {
  if (menuStack.length > 0) {
    const state = menuStack.pop();
    currentMenu = state.currentMenu;
    currentList = state.currentList;
    selectedIndex = state.selectedIndex;
    renderMenu();
  } else {
    currentMenu = "main";
    currentList = [...mainMenu];
    selectedIndex = 0;
    renderMenu();
    contentArea.innerHTML = "";
  }
}

function loadContent(jsonFile) {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      contentArea.innerHTML = "";
      data.forEach(item => {
        const div = document.createElement("div");
        if (item.type === "image") {
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = item.alt || "";
          div.appendChild(img);
        } else if (item.type === "video") {
          const video = document.createElement("video");
          video.src = item.src;
          video.controls = true;
          div.appendChild(video);
        } else if (item.type === "pdf") {
          const iframe = document.createElement("iframe");
          iframe.src = item.src;
          div.appendChild(iframe);
        }
        contentArea.appendChild(div);
      });
    });
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      next();
      break;
    case "ArrowUp":
      previous();
      break;
    case "Enter":
      confirm();
      break;
    case "Escape":
    case "Backspace":
      goHome();
      break;
  }
});

renderMenu(); 
