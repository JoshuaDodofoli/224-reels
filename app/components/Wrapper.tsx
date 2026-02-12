import classNames from "classnames"

interface childrenProps {
    children: React.ReactNode,
    className?: string
}

const Wrapper = ({ children, className='' } : childrenProps) => {
  return (
    <div className={classNames(className, "max-w-375 mx-auto px-4")}>{children}</div>
  )
}

export default Wrapper