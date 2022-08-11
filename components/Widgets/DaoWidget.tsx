import { Link } from 'react-router-dom'
import { FC } from 'react'
import InfoTooltip from '../Common/InfoTooltip'

interface Props {
  title: string
  usdAmount: any
  marketCap: any
  icon: string
  linkTo: string
  tooltip?: string
  tooltipUrl?: string
  extra?: JSX.Element
}

const DaoWidget: FC<Props> = ({
  title,
  usdAmount,
  marketCap,
  icon,
  linkTo,
  tooltip,
  tooltipUrl,
  extra,
}) => {
  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2 hover:bg-gray-300">
      <Link to={linkTo}>
        <div className="flex">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img alt="" src={icon} className="w-7" />
                <div className="font-medium text-lg text-darkgray-800 flex items-center space-x-1.5">
                  <span>{title}</span>
                  {tooltip && <InfoTooltip text={tooltip} href={tooltipUrl} />}
                </div>
              </div>

              <div className="grid text-right">
                <span className="font-medium text-darkgray-800">
                  {usdAmount}
                </span>
                <span className="text-sm text-gray-800">{marketCap}</span>
              </div>
            </div>
            {extra}
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/images/details-arrow.svg"
              width={14}
              height={14}
              alt="arrow right"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default DaoWidget
