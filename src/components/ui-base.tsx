"use client"

// This file contains basic UI components to replace shadcn/ui
import React, { useState, useRef, useEffect } from "react"

// Simple Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ variant = "default", size = "default", className = "", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-700 hover:bg-gray-800 text-white",
    ghost: "hover:bg-gray-800 text-white",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
  }

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6",
    icon: "h-10 w-10",
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

// Simple Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Simple Dropdown Menu
interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "end" | "center"
}

export function DropdownMenu({ trigger, children, align = "end" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const alignmentStyles = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-md ${alignmentStyles[align]}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Simple Toast system
interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
  action?: React.ReactNode
}

interface ToastContextType {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([])

  const toast = (props: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...props, id }])

    if (props.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, props.duration || 3000)
    }
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border p-4 shadow-md ${
              toast.variant === "destructive" ? "border-red-500 bg-red-950" : "border-gray-700 bg-gray-800"
            }`}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm">{toast.description}</div>}
            {toast.action && <div className="mt-2">{toast.action}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastAction({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      className="inline-flex h-8 items-center justify-center rounded-md border border-gray-700 bg-transparent px-3 text-sm font-medium hover:bg-gray-700"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
