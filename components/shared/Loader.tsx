import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
  className?: string
}

function Loader({ className }: Props) {
  return <Loader2 className={cn('animate-spin', className)} />
}

export default Loader
