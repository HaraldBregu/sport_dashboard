import * as React from 'react'
import { SvgIconProps } from './SvgIcon'
import DynamicSvgIcon from './DynamicSvgIcon'

export interface IconProps extends Omit<SvgIconProps, 'children'> {
  name: string
  fallback?: React.ReactNode
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, fallback, ...props }, ref) => {
    return <DynamicSvgIcon ref={ref} name={name} fallback={fallback} {...props} />
  }
)

Icon.displayName = 'Icon'

export default Icon 