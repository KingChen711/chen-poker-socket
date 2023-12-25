import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
  title: string
  description: string
  link?: string
  linkTitle?: string
}

function NoResult({ title, description, link, linkTitle }: Props) {
  return (
    <div className='mt-10 flex w-full flex-col items-center justify-center'>
      <Image src='/assets/images/not-found.png' alt='no result' width={270} height={270} className='object-contain' />
      <h2 className='text-light-900 mt-8 text-[24px] font-bold leading-[31.2px]'>{title}</h2>
      <p className='text-light-700 my-3.5 max-w-md text-center text-[14px] font-normal leading-[19.6px]'>
        {description}
      </p>
      {link && (
        <Link href={link}>
          <Button className='bg-primary text-light-900 hover:bg-primary dark:bg-primary dark:text-light-900 mt-5 min-h-[46px] rounded-lg px-4 py-3 text-[16px] font-medium leading-[22.4px]'>
            {linkTitle}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default NoResult
