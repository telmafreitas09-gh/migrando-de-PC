'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  className,
  fill,
  width = 400,
  height = 300,
  priority,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = failed || !src ? '/placeholder.svg' : src

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
        onError={() => {
          // #region agent log
          fetch('http://127.0.0.1:7538/ingest/105d5053-89a1-4ec7-974e-a3ff2c5d12a4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ef1545'},body:JSON.stringify({sessionId:'ef1545',location:'components/safe-image.tsx:onError',message:'image load failed',data:{src:src?.slice(0,80)},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          setFailed(true)
        }}
      />
    )
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', className)}
      priority={priority}
      onError={() => {
        // #region agent log
        fetch('http://127.0.0.1:7538/ingest/105d5053-89a1-4ec7-974e-a3ff2c5d12a4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ef1545'},body:JSON.stringify({sessionId:'ef1545',location:'components/safe-image.tsx:onError',message:'image load failed',data:{src:src?.slice(0,80)},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        setFailed(true)
      }}
    />
  )
}
