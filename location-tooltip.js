// Tooltip for location button in ad sidebar
(function() {
  let tooltipTimeout = null;
  let currentTooltip = null;

  function closeTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }

  function showTooltip(btn) {
    closeTooltip();
    // מצא את אלמנט כרטיס המודעה
    const adCard = btn.closest('.ad-card');
    // שלוף ערכים
    const city = btn.getAttribute('data-city') || '';
    const neighborhood = btn.getAttribute('data-neighborhood') || '';
    // צור tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'location-tooltip';
    tooltip.innerHTML = `<span class="city">${city ? city : ''}</span>${(city && neighborhood) ? ' | ' : ''}<span class="neighborhood">${neighborhood ? neighborhood : ''}</span>`;
    // מיקום tooltip
    const rect = btn.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.right = (window.innerWidth - rect.right + 40) + 'px';
    tooltip.style.top = (rect.top + rect.height + 6) + 'px';
    tooltip.style.zIndex = 9999;
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;

    // סגירה ב-hover out
    let overBtn = true, overTooltip = false;
    btn.addEventListener('mouseleave', onBtnLeave);
    tooltip.addEventListener('mouseenter', () => { overTooltip = true; });
    tooltip.addEventListener('mouseleave', () => {
      overTooltip = false;
      setTimeout(() => {
        if (!overBtn && !overTooltip) closeTooltip();
      }, 80);
    });
    function onBtnLeave() {
      overBtn = false;
      setTimeout(() => {
        if (!overBtn && !overTooltip) closeTooltip();
      }, 80);
      btn.removeEventListener('mouseleave', onBtnLeave);
    }
    btn.addEventListener('mouseenter', () => { overBtn = true; });
  }

  document.addEventListener('mouseenter', function(e) {
    const btn = e.target.closest('.sidebar-icon.location');
    if (!btn) return;
    showTooltip(btn);
  }, true);

  document.addEventListener('mouseleave', function(e) {
    const btn = e.target.closest('.sidebar-icon.location');
    if (!btn) return;
    setTimeout(() => {
      if (!document.querySelector('.sidebar-icon.location:hover') && !document.querySelector('.location-tooltip:hover')) {
        closeTooltip();
      }
    }, 80);
  }, true);

  // סגירה ב-scroll או resize
  window.addEventListener('scroll', closeTooltip, true);
  window.addEventListener('resize', closeTooltip, true);
})();

