// Shared data — craftsmen, orders, categories, chat mock

const MH_CATEGORIES = [
  { id: 'kitchen', name: 'Кухни', count: 48 },
  { id: 'wardrobe', name: 'Гардеробные', count: 34 },
  { id: 'sofa', name: 'Диваны', count: 27 },
  { id: 'bed', name: 'Кровати', count: 31 },
  { id: 'cabinet', name: 'Шкафы', count: 42 },
  { id: 'chair', name: 'Стулья', count: 19 },
  { id: 'table', name: 'Столы', count: 38 },
  { id: 'shelf', name: 'Стеллажи', count: 22 },
  { id: 'dresser', name: 'Комоды', count: 16 },
];

const MH_DISTRICTS = [
  'Мирабадский', 'Юнусабадский', 'Чиланзарский',
  'Шайхантаурский', 'Яккасарайский', 'Мирзо-Улугбекский',
  'Яшнабадский', 'Сергелийский', 'Учтепинский',
];

const MH_MATERIALS = ['Дуб', 'Ясень', 'Орех', 'Бук', 'Сосна', 'МДФ', 'Металл + дерево', 'Ротанг'];
const MH_STYLES = ['Минимализм', 'Сканди', 'Классика', 'Лофт', 'Модерн', 'Восточный'];

const MH_MASTERS = [
  {
    id: 'm01', name: 'Улугбек Арипов', shop: 'Дуб и Латунь',
    district: 'Юнусабадский', since: 2018, rating: 4.9, reviews: 87,
    speciality: ['Шкафы','Кухни','Гардеробные'], materials: ['Дуб','Орех','Ясень'],
    style: 'Минимализм · Классика',
    priceFrom: 1200, avgDays: 28,
    bio: 'Работаю с массивом дерева — дуб, орех, ясень. Специализация — корпусная мебель с фасадами из шпона и латунной фурнитурой. В мастерской три помощника и собственный столярный цех.',
    worksCount: 42,
    accent: '#3a2d1f',
  },
  {
    id: 'm02', name: 'Шахзод Каримов', shop: 'KARIMOV · Furniture',
    district: 'Мирабадский', since: 2020, rating: 4.8, reviews: 54,
    speciality: ['Диваны','Кресла','Пуфы'],  materials: ['Ткань','Кожа','Бук'],
    style: 'Сканди · Модерн',
    priceFrom: 800, avgDays: 18,
    bio: 'Мягкая мебель на заказ. Работаю с импортными тканями из Турции и Италии, натуральной кожей. Каркасы — берёзовая фанера и бук.',
    worksCount: 31,
    accent: '#2a2e38',
  },
  {
    id: 'm03', name: 'Диёр Назаров', shop: 'ATELIER NAZAROV',
    district: 'Яккасарайский', since: 2015, rating: 5.0, reviews: 112,
    speciality: ['Столы','Стулья','Кабинеты'], materials: ['Орех','Ясень','Камень'],
    style: 'Классика · Премиум',
    priceFrom: 2400, avgDays: 45,
    bio: 'Ателье авторской мебели. Работаю преимущественно с орехом и ясенем, делаю столешницы с инкрустацией латунью и эпоксидными вставками.',
    worksCount: 58,
    accent: '#382416',
  },
  {
    id: 'm04', name: 'Бобур Юлдашев', shop: 'YULDASH WOOD',
    district: 'Чиланзарский', since: 2019, rating: 4.7, reviews: 62,
    speciality: ['Кровати','Комоды','Шкафы'], materials: ['Сосна','МДФ','Дуб'],
    style: 'Лофт · Минимализм',
    priceFrom: 600, avgDays: 21,
    bio: 'Делаю мебель в лофт-стиле — сочетание дерева и металла. Кованые опоры, открытые стеллажи, брутальные столы.',
    worksCount: 27,
    accent: '#2e2a22',
  },
  {
    id: 'm05', name: 'Фарух Мирзаев', shop: 'MIRZAEV · craft',
    district: 'Мирзо-Улугбекский', since: 2017, rating: 4.9, reviews: 91,
    speciality: ['Кухни','Стеллажи','Барные стойки'], materials: ['Дуб','Ясень','Латунь'],
    style: 'Модерн · Восточный',
    priceFrom: 1800, avgDays: 35,
    bio: 'Кухни и встроенная мебель. Работаю с фасадами из массива и шпона, устанавливаю фурнитуру Blum и Hettich. Проектирую в 3D до заключения договора.',
    worksCount: 36,
    accent: '#3a2e1a',
  },
  {
    id: 'm06', name: 'Азамат Ташмухамедов', shop: 'TASHKENT WORKS',
    district: 'Шайхантаурский', since: 2021, rating: 4.6, reviews: 38,
    speciality: ['Столы','Стулья','Скамьи'], materials: ['Сосна','Бук','Металл'],
    style: 'Лофт · Сканди',
    priceFrom: 450, avgDays: 14,
    bio: 'Простая честная мебель из массива. Столы-слэбы, лавки, табуреты. Работаю один, делаю сам от эскиза до сборки.',
    worksCount: 19,
    accent: '#26261e',
  },
];

const MH_ORDERS_FEED = [
  { id: 'o01', title: 'Кухонный гарнитур · U-образный', district: 'Юнусабад', budget: '2 400–3 200 $', offers: 3, time: '12 мин назад', cat: 'kitchen' },
  { id: 'o02', title: 'Гардеробная в спальню 3×2 м', district: 'Мирабад', budget: '1 800–2 400 $', offers: 5, time: '34 мин назад', cat: 'wardrobe' },
  { id: 'o03', title: 'Обеденный стол · орех, раздвижной', district: 'Чиланзар', budget: '900–1 400 $', offers: 2, time: '1 ч назад', cat: 'table' },
  { id: 'o04', title: 'Кровать king-size с подъёмным механизмом', district: 'Яккасарай', budget: '1 200–1 800 $', offers: 4, time: '2 ч назад', cat: 'bed' },
  { id: 'o05', title: 'Комплект барных стульев (6 шт)', district: 'Мирзо-Улугбек', budget: '600–900 $', offers: 7, time: '3 ч назад', cat: 'chair' },
];

const MH_WORKS = [
  { id: 'w01', master: 'm01', title: 'Комод «Бухара»', category: 'dresser', material: 'Дуб · латунь', year: 2025, palette: ['#2d231a','#3a2f23','#E4B668'] },
  { id: 'w02', master: 'm01', title: 'Шкаф-купе «Шёлк»', category: 'wardrobe', material: 'Орех · шпон', year: 2025, palette: ['#2a1d12','#3f2f1e','#8b6a3a'] },
  { id: 'w03', master: 'm03', title: 'Стол «Регистан»', category: 'table', material: 'Орех · эпоксид', year: 2024, palette: ['#1a1008','#302010','#c48a4a'] },
  { id: 'w04', master: 'm02', title: 'Диван «Чорсу»', category: 'sofa', material: 'Бук · кашемир', year: 2025, palette: ['#1c2028','#2a313d','#8a96a8'] },
  { id: 'w05', master: 'm05', title: 'Кухня «Самарканд»', category: 'kitchen', material: 'Дуб · латунь', year: 2024, palette: ['#261c10','#3a2a18','#E4B668'] },
  { id: 'w06', master: 'm04', title: 'Кровать «Ичан-Кала»', category: 'bed', material: 'Сосна · металл', year: 2025, palette: ['#251f15','#38301f','#6a5a3a'] },
  { id: 'w07', master: 'm06', title: 'Стол-слэб «Амударья»', category: 'table', material: 'Карагач · смола', year: 2024, palette: ['#1a120a','#2f2012','#d8a560'] },
  { id: 'w08', master: 'm05', title: 'Стеллаж «Минор»', category: 'shelf', material: 'Ясень · латунь', year: 2025, palette: ['#1f1810','#32261a','#E4B668'] },
  { id: 'w09', master: 'm03', title: 'Кабинет «Улугбек»', category: 'cabinet', material: 'Орех · кожа', year: 2024, palette: ['#1c1208','#2e1f14','#a67442'] },
];

const MH_CHAT_MESSAGES = [
  { from: 'master', name: 'Улугбек Арипов', text: 'Добрый день! Посмотрел ваше ТЗ — интересный проект. Уточню: глубина столешницы 600 или 650?', time: '10:24' },
  { from: 'me', name: 'Вы', text: '650, как в описании. И важно: раковина должна быть с боковой стороны, не по центру.', time: '10:28' },
  { from: 'master', name: 'Улугбек Арипов', text: 'Принято. Материал — дуб матовый, фасады под шпоном. Фурнитура Blum. Прикрепил эскиз в 3D.', time: '10:31' },
  { from: 'master', name: 'Улугбек Арипов', text: '[эскиз_v1.pdf]', time: '10:31', attachment: 'эскиз_v1.pdf · 2.4 MB' },
  { from: 'me', name: 'Вы', text: 'Шикарно. А по срокам и цене?', time: '10:35' },
  { from: 'master', name: 'Улугбек Арипов', text: '28 рабочих дней, 2 850 $. Разбивка: 30% предоплата, 50% перед сборкой, 20% после установки. Гарантия 3 года.', time: '10:37' },
];

Object.assign(window, { MH_CATEGORIES, MH_DISTRICTS, MH_MATERIALS, MH_STYLES, MH_MASTERS, MH_ORDERS_FEED, MH_WORKS, MH_CHAT_MESSAGES });
