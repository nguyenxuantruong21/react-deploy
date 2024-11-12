import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { formatEmailShowUI, getAvatarUrl } from 'src/utils/utils'
import { path } from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { purchasesStatus } from 'src/constants/purchase'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const { i18n } = useTranslation()
  // as vi : tieng viet, en: english
  const currentLanguages = locales[i18n.language as keyof typeof locales]

  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }], exact: true })
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLanguages = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className='flex justify-end pb-3'>
      <Popover
        className='flex items-center py-1 hover:text-gray-300 hover:cursor-pointer text-white'
        renderPopover={
          <div className='bg-white relative shadow-sm rounded-sm border border-gray-200'>
            <div className='flex flex-col py-2 pr-28 '>
              <button className='text-left py-2 px-3 hover:text-orange-600' onClick={() => changeLanguages('vi')}>
                Tiếng Việt
              </button>
              <button className='text-left py-2 px-3 hover:text-orange-600 ' onClick={() => changeLanguages('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span>{currentLanguages}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 hover:text-gray-300 hover:cursor-pointer text-white ml-6'
          renderPopover={
            <div className='bg-white relative shadow-sm rounded-sm border border-gray-200'>
              <div className='flex flex-col py-2 px-2'>
                <Link to={path.profile} className='py-2 px-3 hover:text-[#26aa99] text-left'>
                  Tài khoản của tôi
                </Link>
                <Link to={path.historyPurchase} className='py-2 px-3 hover:text-[#26aa99] text-left'>
                  Đơn mua
                </Link>
                <button className='py-2 px-3  hover:text-[#26aa99] text-left' onClick={handleLogout}>
                  Đăng Xuất
                </button>
              </div>
            </div>
          }
        >
          <div className='w-5 h-5 mr-2 flex-shrink-0 '>
            <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='rounded-full w-full h-full object-cover' />
          </div>
          <div>{profile?.email && formatEmailShowUI(profile?.email)}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize text-white hover:opacity-70'>
            Đăng ký
          </Link>
          <div className='border-r-[1px] border-r-white h-4'></div>
          <Link to={path.login} className='mx-3 capitalize text-white hover:opacity-70'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
