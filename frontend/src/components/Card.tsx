import React from 'react'

interface CardProps {
  children: React.ReactNode
}

export function Card({ children }: CardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
}

export function CardHeader({ children }: CardHeaderProps) {
  return (
    <div className="px-4 py-5 sm:px-6">
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
}

export function CardContent({ children }: CardContentProps) {
  return (
    <div className="px-4 py-5 sm:p-6">
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
}

export function CardTitle({ children }: CardTitleProps) {
  return (
    <h3 className="text-lg leading-6 font-medium text-gray-900">
      {children}
    </h3>
  )
}