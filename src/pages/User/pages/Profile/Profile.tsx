import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { UserSchema, userSchema } from 'src/utils/rules'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/src/yup.js'
import InputNumber from 'src/components/InputNumber'
import { useContext, useEffect, useMemo, useState } from 'react'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosErrorUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<UserSchema, 'name' | 'phone' | 'address' | 'date_of_birth' | 'avatar'>
// type FormDateError form SERVER
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}
const profileSchema = userSchema.pick(['name', 'phone', 'address', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()

  const previewFile = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const {
    control,
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1),
    },
    resolver: yupResolver<FormData>(profileSchema),
  })

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
  })

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
  })

  const profile = profileData?.data.data
  const avatar = watch('avatar')

  // set value in form
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date())
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      // update avatar
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = String(uploadRes.data.data)
        setValue('avatar', avatarName)
      }
      // update information
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName,
      })
      // set profile in app.context
      setProfile(res.data.data)
      // set profile in local storage
      setProfileToLS(res.data.data)
      // refetch()
      toast.success(res.data.message, {
        position: 'top-center',
        autoClose: 1000,
      })
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server',
            })
          })
        }
      }
    }
  })

  // truyen vao props onChange cua component InputFile
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 md:px-7 pb-10 md:pb-20 shadow'>
      <Helmet>
        <title>Trang cá nhân | Shopee Clone</title>
        <meta name='description' content='trang cá nhân dự án shopee clone' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-4'>
        <h1 className='text-gray-900 text-lg font-medium capitalize px-10'>Hồ Sơ Của Tôi</h1>
        <p className='text-gray-700 text-sm mt-1 px-10'>Quản lý trang thông tin hồ sơ để bảo vệ tài khoản</p>
      </div>
      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <form className='flex-grow mt-6 pr-12 md:mt-0' onSubmit={onSubmit}>
          <div className='flex flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
            <div className='sm:w-[80%] pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='flex flex-wrap mt-6  sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                placeholder='Tên'
                name='name'
                errorMassage={errors.name?.message}
              />
            </div>
          </div>
          <div className='flex flex-wrap mt-2  sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
            <div className='sm:w-[80%] pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số Điện Thoại'
                    errorMassage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='flex flex-wrap mt-2  sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
            <div className='sm:w-[80%] pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                placeholder='Địa chỉ'
                name='address'
                errorMassage={errors.name?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} onChange={field.onChange} value={field.value} />
            )}
          />
          <div className='flex flex-wrap mt-5 sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
            <div className='sm:w-[80%] pl-5 '>
              <Button
                type='submit'
                className='sm:w-[30%] md:w-[50px] text-center bg-orange-600 py-2 px-2 text-white  hover:bg-orange-600/80 rounded-sm'
              >
                Lưu
              </Button>
            </div>
          </div>
        </form>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewFile || getAvatarUrl(avatar)}
                alt='avatar'
                className='w-full h-full object-cover rounded-full'
              />
            </div>
            <InputFile onChange={handleChangeFile} />
            <div className='text-center mt-2 text-gray-400'>Dụng lượng file tối đa 1 MB </div>
            <div className='text-center mt-2 text-gray-400'>Định dạng:.JPEG, .PNG</div>
          </div>
        </div>
      </div>
    </div>
  )
}
