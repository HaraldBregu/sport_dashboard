import * as React from 'react'

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode
  viewBox?: string
}

const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(
  ({ children, viewBox = "0 0 24 24", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {children}
      </svg>
    )
  }
)

SvgIcon.displayName = 'SvgIcon'

export default SvgIcon 