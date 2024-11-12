import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
}

const resources = {
  en: {
    translation: {
      'all categories': 'All Categories',
      'filter search': 'Filter Search',
      't-shirt': 'T Shirt',
      '-clock': 'Clock',
      'smart-phone': 'Smart Phone',
      'price-range': 'Price Range',
      '-apply': 'Apply',
      '-Evaluate': 'Evaluate',
      'delete all': 'Delete All',
    },
  },
  vi: {
    translation: {
      'all categories': 'Tất cả danh mục',
      'filter search': 'Bộ lọc tìm kiếm',
      't-shirt': 'Áo thun',
      '-clock': 'Đồng hồ',
      'smart-phone': 'Điện thoại',
      'price-range': 'Khoảng giá',
      '-apply': 'Áp dụng',
      '-Evaluate': 'Đánh giá',
      'delete all': 'Xóa tất cả',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
