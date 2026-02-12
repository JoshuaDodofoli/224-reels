import classNames from "classnames"

interface props {
    children: React.ReactNode
    className?: string
}

const ButtonBorder = ({ children, className }: props) => {
  return (
    <div className={classNames(className, "relative block")}>
      {children}
        <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌜</span>
        <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌝</span>
        <span className="absolute bottom-0 left-0 -translate-x-1 translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌞</span>
        <span className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-4 h-4 flex items-center justify-center text-sm">⌟</span>
    </div>
  )
}

export default ButtonBorder