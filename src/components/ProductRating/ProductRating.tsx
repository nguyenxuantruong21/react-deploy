interface Props {
  rating: number
  activeClassName?: string
  NonactiveClassName?: string
}

export default function ProductRating({
  rating,
  activeClassName = 'w-3 h-3 fill-yellow-300 text-yellow-300',
  NonactiveClassName = 'w-3 h-3 fill-current text-gray-300',
}: Props) {
  const handleWidth = (order: number) => {
    if (order <= rating) {
      return '100%'
    }
    if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'
    }
  }
  return (
    <div className='flex items-center'>
      {Array(5)
        .fill(1)
        .map((_, index) => (
          <div className='relative' key={index}>
            <div className='absolute top-0 left-0 h-full overflow-hidden' style={{ width: handleWidth(index + 1) }}>
              <svg enable-background='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={activeClassName}>
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-miterlimit='10'
                ></polygon>
              </svg>
            </div>
            <svg enable-background='new 0 0 15 15' viewBox='0 0 15 15' x='0' y='0' className={NonactiveClassName}>
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-miterlimit='10'
              ></polygon>
            </svg>
          </div>
        ))}
    </div>
  )
}
