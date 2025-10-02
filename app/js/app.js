document.addEventListener("DOMContentLoaded", () => {
  // Tab mapping to URL parameters and data keys
  const tabConfig = {
    first: { urlParam: "byuser", dataKey: "byuser" },
    second: { urlParam: "byeditors", dataKey: "byeditors" },
    third: { urlParam: "bybonus", dataKey: "bybonus" },
    fourth: { urlParam: "bysubrating", dataKey: "bysubrating" },
  };

  // Get DOM elements
  const tabs = document.querySelectorAll(".controls__tab");
  const tabContents = document.querySelectorAll(".tab-content");

  // Function to get URL query parameter
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to render stars based on rating
  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      starsHtml += `<img src="images/${
        i < fullStars ? "star.svg" : "star-empty.svg"
      }" alt="Звезда" />`;
    }
    return starsHtml;
  }

  // Function to render a single rating item
  function renderRatingItem(item) {
    const badgeHtml = item.badge
      ? `<div class="raitings__badges--badge raitings__badges--badge__${
          item.badge === "exclusive"
            ? "exc"
            : item.badge === "no-deposit"
            ? "nodep"
            : "nob"
        }">
          ${
            item.badge === "exclusive"
              ? "Эксклюзив"
              : item.badge === "no-deposit"
              ? "Без депозита"
              : "Нет бонуса"
          }
        </div>`
      : "";

    const bonusHtml =
      item.bonus_amount > 0
        ? `<div class="raitings__badges--price">
          <img src="images/gift.svg" alt="Цена" />
          <span>${(item.bonus_amount / 1000).toFixed(1)}K ₽</span>
        </div>`
        : "";

    const verifiedHtml = item.verified
      ? `<img src="images/ocheck.svg" alt="Проверено" class="raitings__logo--check" />`
      : "";

    return `
      <div class="raitings">
        <div class="raitings__logo">
          <img src="${item.logo}" alt="Лого" class="raitings__logo--logo" />
          ${verifiedHtml}
        </div>
        <div class="raitings__stars">
          <div class="raitings__stars--stars">
            ${renderStars(item.rating)}
          </div>
          <span>${item.rating}</span>
        </div>
        <div class="raitings__comments">
          <img src="images/chat.svg" alt="Комментарии" />
          <span>${item.review_count}</span>
        </div>
        <div class="raitings__badges">
          ${badgeHtml}
          ${bonusHtml}
        </div>
        <div class="raitings__btns">
          <div class="raitings__btns--review">Обзор</div>
          <div class="raitings__btns--site">Сайт</div>
        </div>
      </div>
    `;
  }

  // Function to render tab content
  function renderTabContent(dataKey, tabId) {
    fetch("databet.json")
      .then((response) => response.json())
      .then((data) => {
        const items = data[dataKey] || [];
        const tabContent = document.getElementById(tabId);
        tabContent.innerHTML = items
          .map((item) => renderRatingItem(item))
          .join("");
      })
      .catch((error) => console.error("Error fetching databet.json:", error));
  }

  // Function to update active tab and content
  function setActiveTab(tabClass, urlParam, dataKey) {
    // Update tab classes
    tabs.forEach((tab) => tab.classList.remove("active"));
    document
      .querySelector(`.controls__tab.${tabClass}`)
      .classList.add("active");

    // Show/hide tab content
    tabContents.forEach((content) => (content.style.display = "none"));
    const activeTabContent = document.getElementById(tabClass);
    activeTabContent.style.display = "block";

    // Render content for the active tab
    renderTabContent(dataKey, tabClass);

    // Update URL
    const base = window.BASE_URL;
    const newUrl = `${base}topbk?type=${urlParam}${
      tabClass === "fourth" ? "&id=reliability" : ""
    }`;
    history.pushState({}, "", newUrl);
  }

  // Initialize based on URL parameter
  const typeParam = getQueryParam("type");
  let initialTab = "first";
  let initialUrlParam = "byuser";
  let initialDataKey = "byuser";

  for (const [tabClass, config] of Object.entries(tabConfig)) {
    if (typeParam === config.urlParam) {
      initialTab = tabClass;
      initialUrlParam = config.urlParam;
      initialDataKey = config.dataKey;
      break;
    }
  }

  setActiveTab(initialTab, initialUrlParam, initialDataKey);

  // Add click event listeners to tabs
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabClass = tab.classList[1]; // e.g., 'first', 'second'
      const { urlParam, dataKey } = tabConfig[tabClass];
      setActiveTab(tabClass, urlParam, dataKey);
    });
  });
});
