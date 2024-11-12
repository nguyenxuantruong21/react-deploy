import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseAPI from 'src/apis/purchase.api'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParam from 'src/hooks/useQueryParam'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' },
]

export default function HistoryPurchase() {
  const queryParam: { status?: string } = useQueryParam()
  const statusQuery: number = Number(queryParam.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: statusQuery }],
    queryFn: () => purchaseAPI.getPurchaseList({ status: statusQuery as PurchaseListStatus }),
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div>
      <Helmet>
        <title>Lịch sử đơn hàng | Shopee Clone</title>
        <meta name='description' content='lịch sử đơn hàng dự án shopee clone' />
      </Helmet>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {purchaseTabs.map((tab) => {
          return (
            <Link
              to={{
                pathname: path.historyPurchase,
                search: createSearchParams({
                  status: String(tab.status),
                }).toString(),
              }}
              className={classNames('flex flex-1 items-center justify-center border-b-2 py-4 bg-white text-center', {
                'border-b-orange-600 text-orange-600': statusQuery === tab.status,
                'border-b-black-600 text-gray-800': statusQuery !== tab.status,
              })}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
      <div>
        {purchasesInCart?.map((purchase) => (
          <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6'>
            <Link
              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
              className='flex'
            >
              <div className='flex-shrink-0'>
                <img src={purchase.product.image} className='h-20 w-20 object-cover' alt='' />
              </div>
              <div className='ml-3 flex-grow overflow-hidden'>
                <div className='truncate'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <span className='truncate text-gray-600 line-through'>
                  ₫{formatCurrency(purchase.price_before_discount)}
                </span>
                <span className='ml-3 text-orange-600 font-medium'>₫{formatCurrency(purchase.price)}</span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div>
                <span>Tổng giá tiền:</span>
                <span className='ml-4 text-xl text-orange-600'>
                  ₫{formatCurrency(purchase.buy_count * purchase.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
