import { useMutation, useQuery } from '@tanstack/react-query'
import React, { Fragment, useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseAPI from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import noProduct from 'src/assets/images/no-product.png'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseAPI.getPurchaseList({ status: purchasesStatus.inCart }),
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseAPI.updatePurchase,
    onSuccess: () => {
      refetch()
    },
  })

  const buyProductMutation = useMutation({
    mutationFn: purchaseAPI.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        autoClose: 1000,
        position: 'top-center',
      })
    },
  })

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseAPI.deletePurchase,
    onSuccess: () => {
      refetch()
    },
  })
  const location = useLocation()
  const choosePurchaseFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchaseCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases],
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases],
  )

  // them thuoc tinh disable, checked vao purchase
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosePurchaseFromLocation = choosePurchaseFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosePurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked),
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosePurchaseFromLocation])

  // delete state
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      }),
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked,
      })),
    )
  }

  // handle decrease increase
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        }),
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  // handle change type
  const handleTypeQuantity = (purchaseIndex: number, value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      }),
    )
  }

  // handle delete 1 item
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  // handle delete many item and all item
  const handleDeleteManyPurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }

  // handel by purchase
  const handleBuyPurchases = () => {
    if (checkedPurchaseCount > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count,
      }))
      buyProductMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title> Giỏ hàng | Shopee Clone</title>
        <meta name='description' content='giỏ hàng dự án shopee clone' />
      </Helmet>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <Fragment>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white text-sm capitalize text-gray-500 shadow px-9 py-5'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h5 w-5 accent-orange-600'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid text-center grid-cols-5'>
                      <div className='col-span-2'>Đơn Giá</div>
                      <div className='col-span-1'>Số Lượng</div>
                      <div className='col-span-1'>Số Tiền</div>
                      <div className='col-span-1'>Thao Tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        className='mt-4 grid grid-cols-12 items-center text-center rounded-sm border border-gray-200 py-5 px-4 text-sm text-gray-500'
                        key={purchase._id}
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h5 w-5 accent-orange-600'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id,
                                  })}`}
                                  className='h-20 w-20 flex-shrink-0'
                                >
                                  <img src={purchase.product.image} alt={purchase.product.name} />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2 text-left'>
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id,
                                    })}`}
                                    className='line-clamp-2'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through ml-3'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='text-gray-500 ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={(value) => handleTypeQuantity(index, value)}
                                disabled={purchase.disabled}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    1 <= value &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count,
                                  )
                                }
                              />
                            </div>
                            <div className='col-span-1'>
                              <div className='text-orange-600'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <button
                                className='bg-none text-black, transition-colors hover:text-orange-600'
                                onClick={handleDelete(index)}
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 flex items-center rounded-sm bg-white p-5 shadow-sm border-gray-100  sm:flex-row sm:items-center'>
              <div className='flex flex-shrink-0 items-center justify-center'>
                <input
                  type='checkbox'
                  className='h-5 p-5 accent-orange-600'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
              </div>
              <button className='mx-3 border-none bb-none '>Chọn tất cả ({extendedPurchases.length})</button>
              <button className='mx-3 border-none bb-none ' onClick={handleDeleteManyPurchase}>
                Xóa
              </button>
              <div className='mt-5 sm:ml-auto sm:mt-0 sm:flex-row sm:items-center '>
                <div>
                  <div className='flex items-center  sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchaseCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange-500'>{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center sm:justify-end text-sm'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange-500'>{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyProductMutation.isLoading}
                  className='mt-5 h-10 w-52 ml-4 flex justify-center items-center text-center bg-red-500  text-white hover:bg-red-600 sm:ml-4 sm:mt-0 rounded-sm'
                >
                  Mua Hàng
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <div className=''>
              <img src={noProduct} className='overflow-hidden w-40 h-40 ' alt='no product' />
            </div>
            <div className='text-gray-400 font-bold'>Giỏ hàng của bạn còn trống</div>
            <button className='my-4 w-40 uppercase  bg-orange-600 h-10 px-3 rounded-sm text-white hover:bg-orange-600/90'>
              <Link to={path.home}>Mua Ngay</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
