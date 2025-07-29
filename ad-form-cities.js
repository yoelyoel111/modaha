// דינמיקה של בחירת עיר ושכונה בטופס פרסום מודעה
window.addEventListener('DOMContentLoaded', function() {
  if (!window.citiesData) return;
  const citySelect = document.createElement('select');
  citySelect.id = 'adCity';
  citySelect.name = 'adCity';
  citySelect.required = true;
  citySelect.setAttribute('form', 'adForm');
  citySelect.innerHTML = '<option value="">בחר עיר...</option>' +
    window.citiesData.filter(city => city.name !== 'כללי').map(city => `<option value="${city.name}">${city.name}</option>`).join('');
  
  const neighborhoodSelect = document.createElement('select');
  neighborhoodSelect.id = 'adNeighborhood';
  neighborhoodSelect.name = 'adNeighborhood';
  neighborhoodSelect.setAttribute('form', 'adForm');
  neighborhoodSelect.innerHTML = '<option value="">כל השכונות</option>';
  neighborhoodSelect.disabled = true;
  
  // הוסף לשדה הייעודי
  const block = document.getElementById('cityNeighborhoodBlock');
  if (block) {
    // label לעיר
    const cityLabel = document.createElement('label');
    cityLabel.htmlFor = 'adCity';
    cityLabel.textContent = 'עיר (חובה)';
    block.appendChild(cityLabel);
    block.appendChild(citySelect);
    // label לשכונה
    const neighLabel = document.createElement('label');
    neighLabel.htmlFor = 'adNeighborhood';
    neighLabel.textContent = 'שכונה (רשות)';
    block.appendChild(neighLabel);
    block.appendChild(neighborhoodSelect);
  }
  // שינוי עיר => טען שכונות
  citySelect.addEventListener('change', function() {
    const city = window.citiesData.find(c => c.name === citySelect.value);
    if(city && city.neighborhoods.length) {
      neighborhoodSelect.innerHTML = '<option value="">כל השכונות</option>' +
        city.neighborhoods.filter(n => n !== 'כללי').map(n => `<option value="${n}">${n}</option>`).join('');
      neighborhoodSelect.disabled = false;
    } else {
      neighborhoodSelect.innerHTML = '<option value="">כל השכונות</option>';
      neighborhoodSelect.disabled = true;
    }
  });
});
