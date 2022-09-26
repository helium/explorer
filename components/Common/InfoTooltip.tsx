import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { FC } from 'react'
import classNames from 'classnames'

interface Props {
  text?: string
  href?: string
  className?: string
}

const InfoTooltip: FC<Props> = ({ text, href, className }) => {
  return (
    <div
      className={classNames(
        className,
        'flex cursor-pointer text-sm text-gray-600',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <MaybeLink href={href}>
        <Tooltip title={text}>
          <InfoCircleOutlined />
        </Tooltip>
      </MaybeLink>
    </div>
  )
}

interface MaybeLinkProps {
  href?: string
  children: JSX.Element
}

const MaybeLink: FC<MaybeLinkProps> = ({ href, children }) => {
  if (!href) return children
  return (
    <a
      className="flex text-gray-600"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

export default InfoTooltip
