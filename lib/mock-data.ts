export const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('')

export type Work = {
  id: string
  master: string
  title: string
  category: string
  material: string
  year: number
  palette: [string, string, string]
}

export const MH_CATEGORIES = [
  { id:'kitchen',  name:'Кухни',       count:48 },
  { id:'wardrobe', name:'Гардеробные', count:34 },
  { id:'sofa',     name:'Диваны',      count:27 },
  { id:'bed',      name:'Кровати',     count:31 },
  { id:'cabinet',  name:'Шкафы',       count:42 },
  { id:'chair',    name:'Стулья',      count:19 },
  { id:'table',    name:'Столы',       count:38 },
  { id:'shelf',    name:'Стеллажи',    count:22 },
  { id:'dresser',  name:'Комоды',      count:16 },
]

export const MH_DISTRICTS = [
  'Мирабадский', 'Юнусабадский', 'Чиланзарский',
  'Шайхантаурский', 'Яккасарайский', 'Мирзо-Улугбекский',
  'Яшнабадский', 'Сергелийский', 'Учтепинский',
]

export const MH_MATERIALS = ['Дуб','Орех','Ясень','Сосна','МДФ','Металл','Кожа','Ткань']
export const MH_STYLES = ['Минимализм','Классика','Лофт','Сканди','Модерн','Восточный']
