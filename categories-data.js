// קובץ קטגוריות מרכזי - יש לטעון אותו גם בדף הבית וגם בדף הניהול
// כל קטגוריה: שם, צבע, אייקון (ניתן להוסיף/לשנות בהמשך)
// מפת צבעים לוגית לקטגוריות
const categoryColorsByName = {
  'בריאות': '#4caf50',
  'מכון כושר': '#ba68c8',
  'מסעדות': '#ff9800',
  'קייטרינג': '#8bc34a',
  'הובלות': '#0099cc',
  'ריהוט': '#8d6e63',
  'עיצוב הבית': '#ffb300',
  'ביגוד': '#e57373',
  'הנעלה': '#a1887f',
  'חסד': '#ffd600',
  'פינות ישיבה': '#81d4fa',
  'נופש': '#ffd54f',
  'ציוד משרדי': '#90caf9',
  'ציוד לגנים': '#aed581',
  'נשים': '#f06292',
  'משלוחים': '#4dd0e1',
  'דיור': '#ffb300',
  'רואי חשבון': '#607d8b',
  'עורכי דין': '#ff8a65',
  'הרצאות': '#ffd600',
  'צילום': '#90a4ae',
  'מחשבים': '#1976d2',
  'סלולר': '#00bcd4',
  'שיפוצים': '#8d6e63',
  'חינוך': '#fbc02d',
  'רפואה טבעית': '#388e3c',
  'השכרת רכב': '#ffa726',
  'תחבורה': '#2196f3',
  'יד 2': '#ffb300',
  'השבת אבידה': '#e57373',
  'פסח': '#ffd600',
  'דרושים': '#00bfae',
};

window.categoriesData = [
  {name: 'פסח', color: '#ffd600', icon: '🌸'},
  {name: 'הובלות', color: '#0099cc', icon: '🚚'},
  {name: 'מסעדות', color: '#ff7043', icon: '🍽️'},
  {name: 'קייטרינג', color: '#4caf50', icon: '🥗'},
  {name: 'טיפול לסוגיו', color: '#b39ddb', icon: '💆'},
  {name: 'ריהוט', color: '#8d6e63', icon: '🛋️'},
  {name: 'עיצוב הבית', color: '#ffb300', icon: '🖼️'},
  {name: 'דרושים', color: '#00bfae', icon: '💼'},
  {name: 'ביגוד', color: '#e57373', icon: '👕'},
  {name: 'הנעלה', color: '#a1887f', icon: '👟'},
  {name: 'חסד', color: '#ffd600', icon: '🤝'},
  {name: 'פינות ישיבה', color: '#81d4fa', icon: '🪑'},
  {name: 'נופש', color: '#ffd54f', icon: '🏖️'},
  {name: 'ציוד משרדי', color: '#90caf9', icon: '📎'},
  {name: 'ציוד לגנים', color: '#aed581', icon: '🧸'},
  {name: 'נשים', color: '#f06292', icon: '👩'},
  {name: 'משלוחים', color: '#4dd0e1', icon: '🚚'},
  {name: 'בריאות', color: '#66bb6a', icon: '🏥'},
  {name: 'מכון כושר', color: '#ba68c8', icon: '🏋️'},
  {name: 'דיור', color: '#ffb300', icon: '🏠'},
  {name: 'רואי חשבון', color: '#607d8b', icon: '📊'},
  {name: 'עורכי דין', color: '#ff8a65', icon: '⚖️'},
  {name: 'הרצאות', color: '#ffd600', icon: '🎤'},
  {name: 'צילום', color: '#90a4ae', icon: '📷'},
  {name: 'מחשבים', color: '#1976d2', icon: '💻'},
  {name: 'סלולר', color: '#00bcd4', icon: '📱'},
  {name: 'שיפוצים', color: '#8d6e63', icon: '🛠️'},
  {name: 'חינוך', color: '#fbc02d', icon: '🎓'},
  {name: 'רפואה טבעית', color: '#388e3c', icon: '🌿'},
  {name: 'השכרת רכב', color: '#ffa726', icon: '🚗'},
  {name: 'תחבורה', color: '#607d8b', icon: '🚌'},
  {name: 'יד 2', color: '#ffb300', icon: '🔄'},
  {name: 'השבת אבידה', color: '#e57373', icon: '🧩'}
];

// עדכון צבע אוטומטי לקטגוריות ללא color
window.categoriesData.forEach(cat => {
  if (!cat.color && categoryColorsByName[cat.name]) {
    cat.color = categoryColorsByName[cat.name];
  }
});
