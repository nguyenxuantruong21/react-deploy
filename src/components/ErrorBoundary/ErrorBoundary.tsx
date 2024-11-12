import { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/path'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className='h-screen w-full flex flex-col justify-center items-center'>
          <h1 className='text-9xl font-extrabold tracking-widest text-gray-700'>500</h1>
          <div className='bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute'>Page Not Found</div>
          <button className='mt-5'>
            <a className='relative inline-block text-sm font-medium text-[#1b1715] group active:text-orange-500 focus:outline-none focus:ring'>
              <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0' />
              <span className='relative block px-8 py-3 bg-[#1A2238] border border-current text-white text-lg'>
                <Link to={path.home}>Go Home</Link>
              </span>
            </a>
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
