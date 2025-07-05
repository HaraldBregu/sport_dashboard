import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Extended button variants with custom app-specific styles
const appButtonVariants = cva(
  buttonVariants(),
  {
    variants: {
      variant: {
        // Inherit all base variants
        default: buttonVariants({ variant: 'default' }),
        destructive: buttonVariants({ variant: 'destructive' }),
        outline: buttonVariants({ variant: 'outline' }),
        secondary: buttonVariants({ variant: 'secondary' }),
        ghost: buttonVariants({ variant: 'ghost' }),
        link: buttonVariants({ variant: 'link' }),
        // Custom app variants
        success: 'bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40',
        warning: 'bg-yellow-600 text-white shadow-xs hover:bg-yellow-700 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-500/40',
        info: 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40',
        gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs hover:from-purple-700 hover:to-pink-700 focus-visible:ring-purple-500/20 dark:focus-visible:ring-purple-500/40',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs hover:bg-white/20 focus-visible:ring-white/20',
        sport: 'bg-orange-600 text-white shadow-xs hover:bg-orange-700 focus-visible:ring-orange-500/20 dark:focus-visible:ring-orange-500/40 font-semibold'
      },
      size: {
        // Inherit all base sizes
        default: buttonVariants({ size: 'default' }),
        sm: buttonVariants({ size: 'sm' }),
        lg: buttonVariants({ size: 'lg' }),
        icon: buttonVariants({ size: 'icon' }),
        // Custom app sizes
        xl: 'h-12 rounded-lg px-8 text-base font-semibold has-[>svg]:px-6',
        '2xl': 'h-14 rounded-xl px-10 text-lg font-bold has-[>svg]:px-8',
        compact: 'h-7 rounded px-2 text-xs font-medium has-[>svg]:px-1.5'
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        default: 'shadow-xs',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
      shadow: 'default'
    }
  }
)

export interface AppButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'className'>,
    VariantProps<typeof appButtonVariants> {
  fullWidth?: boolean
  className?: string
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    shadow,
    fullWidth = false,
    children,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          appButtonVariants({ variant, size, rounded, shadow }),
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

AppButton.displayName = 'AppButton'

export { AppButton, appButtonVariants }
