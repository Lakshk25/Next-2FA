import PageNotFound from '@/components/pageNotFound'

import React from 'react'

const ErrorPage = () => {
  return (

    <div className='flex h-full space-y-5 flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 to-blue-500'><PageNotFound/></div>
    
  )
}

export default ErrorPage