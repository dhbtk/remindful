import React, { ForwardRefExoticComponent, RefAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export default function linkRef (to: string): ForwardRefExoticComponent<Omit<LinkProps, 'to'> & RefAttributes<HTMLAnchorElement>> {
  return React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((linkProps, ref) => (
    <Link ref={ref} to={to} {...linkProps} />
  ))
}
