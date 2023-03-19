const APP_ENTRY_SELECTOR = ".j1ei8c";
const APP_LABEL_SELECTOR = ".Rq5Gcb";
const APP_LIST_SELECTOR = ".LVal7b:not(.app-filter-results)";
const APP_MODAL_SELECTOR = ".EHzcec.eejsDc";

const appModalElement = document.querySelector(APP_MODAL_SELECTOR);

function getAppElements() {
  const appListElements = appModalElement.querySelectorAll(APP_LIST_SELECTOR);
  const appElements = [];
  appListElements.forEach((value, index) => {
    const children = value.querySelectorAll(APP_ENTRY_SELECTOR);
    appElements.push(...Array.from(children));
  });
  return appElements;
}

function filterInputHandler(value) {
  const appElements = getAppElements();
  const appFilterResultElement = appModalElement.querySelector(".app-filter-results");
  appFilterResultElement.innerHTML = "";
  if (value) {
    const filterResults = appElements.filter(element =>
        element.querySelector(APP_LABEL_SELECTOR).textContent
            .toLowerCase()
            .includes(value.toLowerCase()));
    filterResults.forEach(appElement => {
      appFilterResultElement.appendChild(appElement.cloneNode(true));
    });

    const imageElements = appFilterResultElement.querySelectorAll("img");
    Array.from(imageElements)
        .filter(imageElement => imageElement.hasAttribute("data-src"))
        .forEach(imageElement => imageElement.src = imageElement.getAttribute("data-src"));
  }
}

function addInputHandler() {
  const appFilterElement = appModalElement.querySelector(".app-filter");
  appFilterElement.addEventListener("input", () => filterInputHandler(appFilterElement.value));
}

if (appModalElement) {
  const appListElement = appModalElement.querySelector(APP_LIST_SELECTOR);

  fetch(chrome.runtime.getURL("/html/filter.html"))
      .then(response => response.text())
      .then(data => {
        const newElement = document.createElement("div");
        newElement.innerHTML = data;
        appListElement.insertAdjacentElement("beforebegin", newElement);

        addInputHandler();
      });
}

