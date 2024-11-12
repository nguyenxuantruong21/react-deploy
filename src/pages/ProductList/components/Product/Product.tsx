import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { path } from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocial, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='bg-white shadow-sm rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100  overflow-hidden transition-transform'>
        <div className='w-full pt-[100%] relative '>
          <img src={product.image} alt={product.name} className='absolute top-0 left-0 bg-white w-full object-cover' />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-m-[50%] text-gray-500 truncate'>
              <span className='text-sm'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 max-m-[50%] text-red-500 truncate'>
              <span className='text-sm'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <ProductRating rating={product.rating} />
            <div className='flex ml-2 text-sm'>
              <span> {formatNumberToSocial(product.sold)}</span>
              <span className='ml-1'>đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
