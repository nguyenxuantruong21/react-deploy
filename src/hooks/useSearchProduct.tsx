import { createSearchParams, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup/src/yup.js'
import { path } from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import omit from 'lodash/omit'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
export default function useSearchProduct() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(nameSchema),
  })

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name,
          },
          ['order'],
        )
      : {
          ...queryConfig,
          name: data.name,
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString(),
    })
  })
  return { register, onSubmitSearch }
}
