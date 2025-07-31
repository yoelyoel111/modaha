// סרגל סינון מתקדם לערים ושכונות - עיצוב מודרני ומאופטם
class FilterBarManager {
  constructor() {
    this.selectedFilters = {
      cities: [],
      neighborhoods: {}
    };
    this.cachedAdsCounts = null;
    this.cacheTimeout = null;
    this.elements = {};
    this.debounceTimer = null;
    
    this.init();
  }

  init() {
    // cache DOM elements
    this.elements = {
      openBtn: document.getElementById('openFilterBarBtn'),
      filterBar: document.getElementById('filterBar'),
      overlay: document.getElementById('filterBarOverlay'),
      badge: document.getElementById('selectedCityBadge')
    };

    if (!this.elements.openBtn || !this.elements.filterBar || !this.elements.overlay || !window.citiesData) {
      console.warn('Required elements or data not found for FilterBarManager');
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    // פתיחת/סגירת הסרגל
    this.elements.openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleFilterBar();
    });

    // סגירת הסרגל בלחיצה על ה-overlay
    this.elements.overlay.addEventListener('click', () => {
      this.closeFilterBar();
    });

    // סגירת תפריטים בלחיצה מחוץ לאזור
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.city-dropdown')) {
        this.closeAllDropdowns();
      }
    });

    // מאזין לשינויים ב-localStorage
    window.addEventListener('storage', () => {
      this.invalidateCache();
    });
  }

  toggleFilterBar() {
    if (this.elements.filterBar.style.display === 'block') {
      this.closeFilterBar();
    } else {
      this.openFilterBar();
    }
  }

  openFilterBar() {
    this.elements.filterBar.style.display = 'block';
    this.elements.filterBar.setAttribute('aria-hidden', 'false');
    this.renderFilterBar();
    
    // focus management for accessibility
    setTimeout(() => {
      const firstInput = this.elements.filterBar.querySelector('input, button');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  closeFilterBar() {
    this.elements.filterBar.style.display = 'none';
    this.elements.filterBar.setAttribute('aria-hidden', 'true');
    this.closeAllDropdowns();
    this.elements.openBtn.focus(); // return focus
  }

  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.city-dropdown.open');
    dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
  }

  invalidateCache() {
    this.cachedAdsCounts = null;
    if (this.cacheTimeout) {
      clearTimeout(this.cacheTimeout);
    }
  }

  getAdsCounts() {
    if (this.cachedAdsCounts) {
      return this.cachedAdsCounts;
    }

    try {
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
      
      // cache for 30 seconds
      this.cachedAdsCounts = counts;
      this.cacheTimeout = setTimeout(() => {
        this.cachedAdsCounts = null;
      }, 30000);
      
      return counts;
    } catch (error) {
      console.error('Error parsing ads data:', error);
      return { cities: {}, neighborhoods: {} };
    }
  }

  renderFilterBar() {
    this.elements.filterBar.innerHTML = '';
    
    // כפתור סגירה
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-filter-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = this.closeFilterBar.bind(this);
    this.elements.filterBar.appendChild(closeBtn);
    
    // כותרת
    const title = document.createElement('h3');
    title.textContent = 'סינון מתקדם לפי ערים ושכונות';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    this.elements.filterBar.appendChild(title);
    
    // קבלת מונה המודעות
    const adsCounts = this.getAdsCounts();
    
    // יצירת הקונטיינר הראשי
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';
    
    // כפתור "כל הסינונים" לאיפוס
    const totalAds = Object.values(adsCounts.cities).reduce((sum, count) => sum + count, 0);
    const allFiltersBtn = this.createFilterButton(`כל הסינונים (${totalAds})`, 'all', this.selectedFilters.cities.length === 0);
    allFiltersBtn.onclick = function() {
      this.selectedFilters.cities = [];
      this.selectedFilters.neighborhoods = {};
      this.renderFilterBar();
      this.applyFilters();
    }.bind(this);
    filtersContainer.appendChild(allFiltersBtn);
    
    // יצירת כפתורי ערים
    const validCities = window.citiesData.filter(city => city.name && city.name !== 'כללי');
    validCities.forEach(city => {
      const cityBtn = this.createCityFilterButton(city, adsCounts);
      filtersContainer.appendChild(cityBtn);
    });
    
    this.elements.filterBar.appendChild(filtersContainer);
    
    // כפתור החלה
    const applyBtn = document.createElement('button');
    applyBtn.className = 'apply-filter-btn';
    applyBtn.textContent = 'הצג';
    applyBtn.onclick = this.applyFilters.bind(this);
    
    // כפתור נקה הכל
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-filter-btn';
    clearBtn.textContent = 'נקה הכל';
    clearBtn.onclick = function() {
      this.selectedFilters.cities = [];
      this.selectedFilters.neighborhoods = {};
      this.renderFilterBar();
      this.applyFilters();
    }.bind(this);
    
    // קונטיינר לכפתורים
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'filter-actions';
    buttonsContainer.appendChild(applyBtn);
    buttonsContainer.appendChild(clearBtn);
    this.elements.filterBar.appendChild(buttonsContainer);
  }

  createFilterButton(text, type, isSelected) {
    const btn = document.createElement('div');
    btn.className = `filter-btn ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span>${text}</span>
      ${type !== 'all' ? '<span class="dropdown-arrow">▼</span>' : ''}
    `;
    return btn;
  }

  createCityFilterButton(city, adsCounts) {
    const isCitySelected = this.selectedFilters.cities.includes(city.name);
    const hasNeighborhoods = city.neighborhoods && city.neighborhoods.length > 0;
    const cityAdsCount = adsCounts.cities[city.name] || 0;
    
    const cityContainer = document.createElement('div');
    cityContainer.className = 'city-dropdown';
    
    const cityBtn = this.createFilterButton(`${city.name} (${cityAdsCount})`, 'city', isCitySelected);
    
    // הוספת checkbox לעיר
    const cityCheckbox = document.createElement('input');
    cityCheckbox.type = 'checkbox';
    cityCheckbox.checked = isCitySelected;
    cityCheckbox.style.marginLeft = '8px';
    cityCheckbox.onchange = function(e) {
      e.stopPropagation();
      this.toggleCitySelection(city.name);
    }.bind(this);
    cityBtn.insertBefore(cityCheckbox, cityBtn.firstChild);
    
    cityBtn.onclick = function(e) {
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
        
        const isSelected = this.selectedFilters.neighborhoods[city.name] && 
                          this.selectedFilters.neighborhoods[city.name].includes(neighborhood);
        
        const neighborhoodCount = (adsCounts.neighborhoods[city.name] && adsCounts.neighborhoods[city.name][neighborhood]) || 0;
        
        neighborhoodItem.innerHTML = `
          <label class="neighborhood-label ${isSelected ? 'selected' : ''}">
            <input type="checkbox" ${isSelected ? 'checked' : ''}>
            <span>${neighborhood} (${neighborhoodCount})</span>
          </label>
        `;
        
        const checkbox = neighborhoodItem.querySelector('input');
        checkbox.onchange = function() {
          this.toggleNeighborhoodSelection(city.name, neighborhood);
        }.bind(this);
        
        neighborhoodsMenu.appendChild(neighborhoodItem);
      });
      
      cityContainer.appendChild(neighborhoodsMenu);
    }
    
    return cityContainer;
  }

  toggleCitySelection(cityName) {
    const index = this.selectedFilters.cities.indexOf(cityName);
    if (index > -1) {
      // הסרת העיר מהבחירה
      this.selectedFilters.cities.splice(index, 1);
      delete this.selectedFilters.neighborhoods[cityName];
    } else {
      // הוספת העיר לבחירה
      this.selectedFilters.cities.push(cityName);
    }
    this.renderFilterBar();
  }

  toggleNeighborhoodSelection(cityName, neighborhood) {
    if (!this.selectedFilters.neighborhoods[cityName]) {
      this.selectedFilters.neighborhoods[cityName] = [];
    }
    
    const neighborhoods = this.selectedFilters.neighborhoods[cityName];
    const index = neighborhoods.indexOf(neighborhood);
    
    if (index > -1) {
      neighborhoods.splice(index, 1);
      if (neighborhoods.length === 0) {
        delete this.selectedFilters.neighborhoods[cityName];
        const cityIndex = this.selectedFilters.cities.indexOf(cityName);
        if (cityIndex > -1) {
          this.selectedFilters.cities.splice(cityIndex, 1);
        }
      }
    } else {
      neighborhoods.push(neighborhood);
      if (!this.selectedFilters.cities.includes(cityName)) {
        this.selectedFilters.cities.push(cityName);
      }
    }
    
    this.renderFilterBar();
  }

  applyFilters() {
    // שמירת הבחירות במשתנים גלובליים
    window.selectedCityFilters = this.selectedFilters.cities;
    window.selectedNeighborhoodFilters = this.selectedFilters.neighborhoods;
    
    // עדכון התג
    this.updateFilterBadge();
    
    // קריאה לפונקציית הסינון
    this.filterAndRenderAds();
  }

  filterAndRenderAds() {
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    let filteredAds = ads;
    
    // סינון לפי ערים ושכונות
    if (this.selectedFilters.cities.length > 0) {
      filteredAds = filteredAds.filter(ad => {
        const adCity = ad.city || 'כללי';
        
        // בדיקה אם העיר נבחרה
        if (this.selectedFilters.cities.includes(adCity)) {
          // אם יש שכונות נבחרות לעיר הזו
          if (this.selectedFilters.neighborhoods[adCity] && this.selectedFilters.neighborhoods[adCity].length > 0) {
            const adNeighborhood = ad.neighborhood || 'כללי';
            return this.selectedFilters.neighborhoods[adCity].includes(adNeighborhood);
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
    this.closeFilterBar();
  }

  // עדכון תג הסינון
  updateFilterBadge() {
    const badge = this.elements.badge;
    if (badge) {
      if (this.selectedFilters.cities.length > 0) {
        badge.textContent = `${this.selectedFilters.cities.length} ערים`;
        badge.style.display = 'inline';
      } else {
        badge.style.display = 'none';
      }
    }
  }
}

// סרגל סינון מתקדם לערים ושכונות - עיצוב מודרני
window.addEventListener('DOMContentLoaded', function() {
  const filterBarManager = new FilterBarManager();
});
