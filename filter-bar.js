// סרגל סינון מתקדם לערים ושכונות - עיצוב מודרני
window.addEventListener('DOMContentLoaded', function() {
  // סגירת חלון הסינון בלחיצה מחוץ אליו
  document.addEventListener('mousedown', function(event) {
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;
    if (filterBar.style.display === 'block') {
      // אם נלחץ מחוץ ל-filter-bar
      // לא נסגור אם נלחץ על צ'קבוקס שכונה
      if (!event.target.closest('.filter-bar')) {
        closeFilterBar();
      }
      // אם נלחץ על צ'קבוקס שכונה - לא נסגור
      if (event.target.classList && event.target.classList.contains('neighborhood-checkbox')) {
        return;
      }
    }
  });
  const openBtn = document.getElementById('openFilterBarBtn');
  const filterBar = document.getElementById('filterBar');
  const overlay = document.getElementById('filterBarOverlay');
  
  if (!openBtn || !filterBar || !overlay || !window.citiesData) return;

  // משתנים גלובליים לבחירות
  let selectedFilters = {
    cities: [], // רשימת ערים נבחרות
    neighborhoods: {} // אובייקט של עיר -> רשימת שכונות
  };

  // פתיחת/סגירת הסרגל
  openBtn.onclick = function(e) {
    e.preventDefault();
    if (filterBar.style.display === 'block') {
      closeFilterBar();
    } else {
      openFilterBar();
    }
  };

  function openFilterBar() {
    filterBar.style.display = 'block';
    renderFilterBar();
  }

  function closeFilterBar() {
    filterBar.style.display = 'none';
    // סגירת כל התפריטים הנגללים
    document.querySelectorAll('.city-dropdown').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }

  function getAdsCounts() {
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const counts = {
      cities: {},
      neighborhoods: {}
    };
    
    ads.forEach(ad => {
      const city = ad.city || 'כללי';
      const neighborhood = ad.neighborhood || 'כללי';
      
      // ספירת מודעות לפי עיר
      counts.cities[city] = (counts.cities[city] || 0) + 1;
      
      // ספירת מודעות לפי שכונה
      if (!counts.neighborhoods[city]) {
        counts.neighborhoods[city] = {};
      }
      counts.neighborhoods[city][neighborhood] = (counts.neighborhoods[city][neighborhood] || 0) + 1;
    });
    
    return counts;
  }

  // משתנה גלובלי לשמירת העיר שתפריט השכונות שלה פתוח
  let openNeighborhoodCity = window.openNeighborhoodCity || null;

  function renderFilterBar() {
    filterBar.innerHTML = '';
    
    // כפתור סגירה
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-filter-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeFilterBar;
    filterBar.appendChild(closeBtn);
    
    // כותרת
    const title = document.createElement('h3');
    title.textContent = 'סינון מתקדם לפי ערים ושכונות';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    filterBar.appendChild(title);
    
    // קבלת מונה המודעות
    const adsCounts = getAdsCounts();
    
    // יצירת הקונטיינר הראשי
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    // כפתור "כל הסינונים" לאיפוס
    const totalAds = Object.values(adsCounts.cities).reduce((sum, count) => sum + count, 0);
    const allFiltersBtn = createFilterButton(`כל הסינונים (${totalAds})`, 'all', selectedFilters.cities.length === 0);
    allFiltersBtn.onclick = function() {
      selectedFilters.cities = [];
      selectedFilters.neighborhoods = {};
      renderFilterBar();
      applyFilters();
    };
    filtersContainer.appendChild(allFiltersBtn);
    
    // יצירת כפתורי ערים
    const validCities = window.citiesData.filter(city => city.name && city.name !== 'כללי');
    validCities.forEach(city => {
      const cityBtn = createCityFilterButton(city, adsCounts);
      // אם זו העיר שפתוחה, פתח את התפריט שלה
      if (openNeighborhoodCity === city.name) {
        cityBtn.classList.add('open');
      }
      filtersContainer.appendChild(cityBtn);
    });
    
    filterBar.appendChild(filtersContainer);
    
    // כפתור החלה
    const applyBtn = document.createElement('button');
    applyBtn.className = 'apply-filter-btn';
    applyBtn.textContent = 'הצג';
    applyBtn.onclick = function() {
      applyFilters();
    };
    
    // כפתור נקה הכל
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-filter-btn';
    clearBtn.textContent = 'נקה הכל';
    clearBtn.onclick = function() {
      selectedFilters.cities = [];
      selectedFilters.neighborhoods = {};
      renderFilterBar();
      applyFilters();
    };
    
    // קונטיינר לכפתורים
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'filter-actions';
    buttonsContainer.appendChild(applyBtn);
    buttonsContainer.appendChild(clearBtn);
    filterBar.appendChild(buttonsContainer);
  }

  function createFilterButton(text, type, isSelected) {
    const btn = document.createElement('div');
    btn.className = `filter-btn ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span>${text}</span>
      ${type !== 'all' ? '<span class="dropdown-arrow">▼</span>' : ''}
    `;
    return btn;
  }

  function createCityFilterButton(city, adsCounts) {
    // נשתמש במשתנה גלובלי כדי לדעת איזו עיר פתוחה
    openNeighborhoodCity = window.openNeighborhoodCity || null;
    const isCitySelected = selectedFilters.cities.includes(city.name);
    const hasNeighborhoods = city.neighborhoods && city.neighborhoods.length > 0;
    const cityAdsCount = adsCounts.cities[city.name] || 0;
    
    const cityContainer = document.createElement('div');
    cityContainer.className = 'city-dropdown';
    
    const cityBtn = createFilterButton(`${city.name} (${cityAdsCount})`, 'city', isCitySelected);
    
    // הוספת checkbox לעיר
    const cityCheckbox = document.createElement('input');
    cityCheckbox.type = 'checkbox';
    cityCheckbox.checked = isCitySelected;
    cityCheckbox.style.marginLeft = '8px';
    cityCheckbox.onchange = function(e) {
      e.stopPropagation();
      toggleCitySelection(city.name);
    };
    cityBtn.insertBefore(cityCheckbox, cityBtn.firstChild);
    
    cityBtn.onclick = function(e) {
      // שמור איזו עיר פתוחה בתפריט
      if (hasNeighborhoods && !e.target.matches('input[type="checkbox"]')) {
        if (cityContainer.classList.contains('open')) {
          window.openNeighborhoodCity = null;
        } else {
          window.openNeighborhoodCity = city.name;
        }
      }
      e.stopPropagation();
      
      if (hasNeighborhoods && !e.target.matches('input[type="checkbox"]')) {
        // פתיחה/סגירה של תפריט השכונות
        const isOpen = cityContainer.classList.contains('open');
        
        if (isOpen) {
          cityContainer.classList.remove('open');
        } else {
          // סגירת כל התפריטים האחרים
          document.querySelectorAll('.city-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
          });
          cityContainer.classList.add('open');
          
          // וידוא שתפריט השכונות מופיע במקום הנכון
          setTimeout(() => {
            const menu = cityContainer.querySelector('.neighborhoods-menu');
            if (menu) {
              const rect = cityContainer.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              
              // אם התפריט חורג מהמסך, הזז אותו שמאלה
              if (rect.right + 200 > viewportWidth) {
                menu.style.right = 'auto';
                menu.style.left = '0';
              }
            }
          }, 10);
        }
      }
    };
    
    cityContainer.appendChild(cityBtn);
    
    // יצירת תפריט השכונות
    if (hasNeighborhoods) {
      const neighborhoodsMenu = document.createElement('div');
      neighborhoodsMenu.className = 'neighborhoods-menu';
      
      const validNeighborhoods = city.neighborhoods.filter(n => n && n !== 'כללי');
      validNeighborhoods.forEach(neighborhood => {
        const neighborhoodItem = document.createElement('div');
        neighborhoodItem.className = 'neighborhood-item';
        
        const isSelected = selectedFilters.neighborhoods[city.name] && 
                          selectedFilters.neighborhoods[city.name].includes(neighborhood);
        
        const neighborhoodCount = (adsCounts.neighborhoods[city.name] && adsCounts.neighborhoods[city.name][neighborhood]) || 0;
        
        neighborhoodItem.innerHTML = `
          <label class="neighborhood-label ${isSelected ? 'selected' : ''}">
            <input type="checkbox" ${isSelected ? 'checked' : ''}>
            <span>${neighborhood} (${neighborhoodCount})</span>
          </label>
        `;
        
        const checkbox = neighborhoodItem.querySelector('input');
        checkbox.onchange = function(e) {
          toggleNeighborhoodSelection(city.name, neighborhood);
          // מונע סגירה של תפריט השכונות
          e.stopPropagation();
          // משאיר את התפריט פתוח
          window.openNeighborhoodCity = city.name;
          cityContainer.classList.add('open');
        };

        
        neighborhoodsMenu.appendChild(neighborhoodItem);
      });
      
      cityContainer.appendChild(neighborhoodsMenu);
    }
    
    return cityContainer;
  }

  function toggleCitySelection(cityName) {
    const index = selectedFilters.cities.indexOf(cityName);
    if (index > -1) {
      // הסרת העיר מהבחירה
      selectedFilters.cities.splice(index, 1);
      delete selectedFilters.neighborhoods[cityName];
    } else {
      // הוספת העיר לבחירה
      selectedFilters.cities.push(cityName);
    }
    renderFilterBar();
  }

  function toggleNeighborhoodSelection(cityName, neighborhood) {
    if (!selectedFilters.neighborhoods[cityName]) {
      selectedFilters.neighborhoods[cityName] = [];
    }
    
    const neighborhoods = selectedFilters.neighborhoods[cityName];
    const index = neighborhoods.indexOf(neighborhood);
    
    if (index > -1) {
      neighborhoods.splice(index, 1);
      if (neighborhoods.length === 0) {
        delete selectedFilters.neighborhoods[cityName];
        const cityIndex = selectedFilters.cities.indexOf(cityName);
        if (cityIndex > -1) {
          selectedFilters.cities.splice(cityIndex, 1);
        }
      }
    } else {
      neighborhoods.push(neighborhood);
      if (!selectedFilters.cities.includes(cityName)) {
        selectedFilters.cities.push(cityName);
      }
    }
    
    renderFilterBar();
  }

  function applyFilters() {
    // שמירת הבחירות במשתנים גלובליים
    window.selectedCityFilters = selectedFilters.cities;
    window.selectedNeighborhoodFilters = selectedFilters.neighborhoods;
    
    // עדכון התג
    updateFilterBadge();
    
    // קריאה לפונקציית הסינון
    filterAndRenderAds();
  }

  function filterAndRenderAds() {
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    let filteredAds = ads;
    
    // סינון לפי ערים ושכונות
    if (selectedFilters.cities.length > 0) {
      filteredAds = filteredAds.filter(ad => {
        const adCity = ad.city || 'כללי';
        
        // בדיקה אם העיר נבחרה
        if (selectedFilters.cities.includes(adCity)) {
          // אם יש שכונות נבחרות לעיר הזו
          if (selectedFilters.neighborhoods[adCity] && selectedFilters.neighborhoods[adCity].length > 0) {
            const adNeighborhood = ad.neighborhood || 'כללי';
            return selectedFilters.neighborhoods[adCity].includes(adNeighborhood);
          }
          // אם אין שכונות נבחרות, מציגים את כל המודעות מהעיר
          return true;
        }
        
        return false;
      });
    }
    
    // קריאה לפונקציית הרינדור עם המודעות המסוננות
    if (window.renderAds) {
      window.renderAds(filteredAds);
    }
    
    // סגירת הסרגל אחרי החלת הסינון
    closeFilterBar();
  }

  // עדכון תג הסינון
  function updateFilterBadge() {
    const badge = document.getElementById('selectedCityBadge');
    if (badge) {
      if (selectedFilters.cities.length > 0) {
        badge.textContent = `${selectedFilters.cities.length} ערים`;
        badge.style.display = 'inline';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // סגירת תפריטים בלחיצה מחוץ לאזור
  document.addEventListener('click', function(e) {
    // אם לוחצים על צ'קבוקס שכונה, לא נסגור את תפריט השכונות
    if (e.target.classList && e.target.classList.contains('neighborhood-checkbox')) {
      return;
    }
    if (!e.target.closest('.city-dropdown')) {
      document.querySelectorAll('.city-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }
  });

  // סגירת הסרגל בלחיצה על ה-overlay
  overlay.addEventListener('click', function() {
    closeFilterBar();
  });
});
