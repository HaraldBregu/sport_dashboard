import * as React from 'react'
import { SvgIconProps } from './SvgIcon'

export interface DynamicSvgIconProps extends Omit<SvgIconProps, 'children'> {
  name: string
  fallback?: React.ReactNode
}

const DynamicSvgIcon = React.forwardRef<SVGSVGElement, DynamicSvgIconProps>(
  ({ name, fallback, ...props }, ref) => {
    const [IconComponent, setIconComponent] = React.useState<React.ComponentType<SvgIconProps> | null>(null)
    const [error, setError] = React.useState<boolean>(false)

    React.useEffect(() => {
      const loadIcon = async () => {
        try {
          // Try to import the SVG file dynamically
          const module = await import(`./icons/${name}.svg`)
          setIconComponent(() => module.default)
          setError(false)
        } catch (err) {
          console.warn(`Failed to load icon: ${name}`, err)
          setError(true)
          setIconComponent(null)
        }
      }

      if (name) {
        loadIcon()
      }
    }, [name])

    if (error) {
      return fallback ? (
        <svg ref={ref} {...props}>
          {fallback}
        </svg>
      ) : (
        <svg
          ref={ref}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400"
          {...props}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        </svg>
      )
    }

    if (!IconComponent) {
      return (
        <svg
          ref={ref}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-300 animate-pulse"
          {...props}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1" />
        </svg>
      )
    }

    return <IconComponent ref={ref} {...props} />
  }
)

DynamicSvgIcon.displayName = 'DynamicSvgIcon'

export default DynamicSvgIcon 