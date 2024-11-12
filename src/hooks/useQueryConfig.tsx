import { ProductListConfig } from 'src/types/product.type'
import useQueryParam from './useQueryParam'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParam()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: (queryParams.limit = '10'),
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_ming: queryParams.price_min,
      name: queryParams.name,
      category: queryParams.category,
    },
    isUndefined,
  )
  return queryConfig
}
