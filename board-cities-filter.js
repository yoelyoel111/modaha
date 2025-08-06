// סינון מודעות לפי ערים ושכונות בגליון הראשי
(function() {
  // סינון ערים/שכונות דרך הסרגל החדש בלבד
  if (!window.citiesData) return;
  const filtersDiv = document.querySelector('.filters');
  if (!filtersDiv) return;

  // יצירת אזור תיבות סימון לערים
  const cityBox = document.createElement('div');
  cityBox.className = 'checkbox-group cities-group';
  cityBox.innerHTML = '<div class="group-title">ערים:</div>' +
    window.citiesData.map(city => `
      <label class="checkbox-label">
        <input type="checkbox" class="city-checkbox" value="${city.name}">
        <span>${city.name}</span>
      </label>
    `).join('');
  filtersDiv.appendChild(cityBox);

  // אזור תיבות סימון לשכונות (מתעדכן דינמית)
  const neighborhoodBox = document.createElement('div');
  neighborhoodBox.className = 'checkbox-group neighborhoods-group';
  neighborhoodBox.innerHTML = '<div class="group-title">שכונות:</div>';
  filtersDiv.appendChild(neighborhoodBox);

  // כפתור הצג
  const showBtn = document.createElement('button');
  showBtn.className = 'show-filter-btn';
  showBtn.textContent = 'הצג';
  filtersDiv.appendChild(showBtn);

  // שמירה על הבחירות
  let selectedCities = [];
  let selectedNeighborhoods = [];

  // עדכון שכונות לפי ערים מסומנות
  function updateNeighborhoods() {
    const checkedCities = Array.from(filtersDiv.querySelectorAll('.city-checkbox:checked')).map(cb => cb.value);
    let neighborhoods = [];
    checkedCities.forEach(cityName => {
      const city = window.citiesData.find(c => c.name === cityName);
      if(city && city.neighborhoods.length) neighborhoods = neighborhoods.concat(city.neighborhoods);
    });
    neighborhoods = [...new Set(neighborhoods)];
    // שמור שכונות שסומנו לפני העדכון
    const prevSelected = Array.from(filtersDiv.querySelectorAll('.neighborhood-checkbox:checked')).map(cb => cb.value);
    if (neighborhoods.length) {
      neighborhoodBox.innerHTML = '<div class="group-title">שכונות:</div>' + neighborhoods.map(n => `
        <label class="checkbox-label">
          <input type="checkbox" class="neighborhood-checkbox" value="${n}" ${prevSelected.includes(n) ? 'checked' : ''}>
          <span>${n}</span>
        </label>
      `).join('');
    } else {
      neighborhoodBox.innerHTML = '<div class="group-title">שכונות:</div>';
    }
  }

  filtersDiv.addEventListener('change', function(e) {
    if (e.target.classList.contains('city-checkbox')) {
      updateNeighborhoods();
    }
  });

  // שמור את renderAds המקורי
  const origRenderAds = window.renderAds || function() {};

  // כפתור הצג מסנן בפועל
  showBtn.addEventListener('click', function() {
    selectedCities = Array.from(filtersDiv.querySelectorAll('.city-checkbox:checked')).map(cb => cb.value);
    selectedNeighborhoods = Array.from(filtersDiv.querySelectorAll('.neighborhood-checkbox:checked')).map(cb => cb.value);
    console.log('ערים נבחרות:', selectedCities);
    console.log('שכונות נבחרות:', selectedNeighborhoods);
    window.renderAds();
  });

  // דריסת renderAds
  window.renderAds = function(filteredAds) {
    console.log('renderAds נקרא עם הפרמטר:', filteredAds);
    
    // אם קיבלנו מערך מסונן, נשתמש בו
    if (Array.isArray(filteredAds)) {
      console.log('מערך מסונן התקבל:', filteredAds);
      origRenderAds(filteredAds);
      return;
    }
    
    // אחרת נבצע סינון לפי הערים והשכונות שנבחרו
    const ads = JSON.parse(localStorage.getItem('ads')||'[]');
    console.log('סה"כ מודעות:', ads.length);
    let resultAds = [...ads];
    
    if (selectedCities.length) {
      resultAds = resultAds.filter(ad => {
        const match = selectedCities.includes(ad.city || 'כללי');
        console.log('בדיקת עיר:', ad.city, 'נבחרו:', selectedCities, 'תואם:', match);
        return match;
      });
    }
    
    if (selectedNeighborhoods.length) {
      resultAds = resultAds.filter(ad => {
        const match = selectedNeighborhoods.includes(ad.neighborhood);
        console.log('בדיקת שכונה:', ad.neighborhood, 'נבחרו:', selectedNeighborhoods, 'תואם:', match);
        return match;
      });
    }
    
    console.log('מודעות אחרי סינון:', resultAds.length);
    origRenderAds(resultAds);
  };

  // הצגה ראשונית
  window.renderAds();
})();
