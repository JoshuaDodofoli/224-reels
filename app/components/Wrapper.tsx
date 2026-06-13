import classNames from "classnames"

interface childrenProps {
    children: React.ReactNode,
    className?: string,
    noPadding?: boolean
}

const Wrapper = ({ children, className='', noPadding=false } : childrenProps) => {
  return (
    <div className={classNames("max-w-380 mx-auto", { "px-4": !noPadding }, className)}>{children}</div>
  )
}

export default Wrapper