// קוד שמחבר את הסינון החדש להצגת מודעות בפועל
window.applyCityNeighborhoodFilter = function() {
  // window.selectedCities: array of selected cities
  // window.selectedNeighborhoods: {city: [hood, ...], ...}
  const ads = JSON.parse(localStorage.getItem('ads')||'[]');
  let filteredAds = ads;
  if (window.selectedCities && window.selectedCities.length) {
    filteredAds = filteredAds.filter(ad => window.selectedCities.includes(ad.city));
  }
  if (window.selectedNeighborhoods) {
    filteredAds = filteredAds.filter(ad => {
      if (!ad.city) return true;
      if (!window.selectedNeighborhoods[ad.city] || window.selectedNeighborhoods[ad.city].length === 0) return true;
      return window.selectedNeighborhoods[ad.city].includes(ad.neighborhood);
    });
  }
  window.renderAds(filteredAds);
}
// אפשר להפעיל גם בלחיצה על "הצג" בסרגל
