import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export const FeatureGrid = () => {
  return (
    <div className={cn("grid grid-cols-3 gap-3")}>
        <Card className='bg-blue-300'>Card 1</Card>
        <Card className='bg-green-300 col-span-2'>Card 3</Card>
        <Card className='bg-red-300 col-span-2'>Card 4</Card>
        <Card className='bg-purple-300'>Card 6</Card>
        <Card className='bg-teal-300'>Card 1</Card>
        <Card className='bg-orange-300 col-span-2'>Card 3</Card>
    </div>
  )
}


const Card = ({ children, className }: { 
    children: ReactNode
    className?: string}) => {
    return <div className={cn("rounded-md p-4 min-w-50 shadow-md", className)}>
        {children}
    </div>
}