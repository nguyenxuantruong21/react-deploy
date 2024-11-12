import { useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'
import SortProductList from './components/SortProductList'
import productApi from 'src/apis/product.api'
import Product from './components/Product'
import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import categoriesApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['Products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
  })

  // category
  const { data: categoriesData } = useQuery({
    queryKey: ['Categories'],
    queryFn: () => {
      return categoriesApi.getCategories()
    },
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Sản phẩm | Shopee Clone</title>
        <meta name='description' content='chi tiết sản phẩm của dự án shopee clone' />
      </Helmet>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 '>
                {productData &&
                  productData.data.data.products.map((product: any) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
