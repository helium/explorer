import Image from 'next/image'
import animalHash from 'angry-purple-tiger'
import ConsensusIndicator from '../Validators/ConsensusIndicator'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import ValidatorStatusPill from '../Validators/ValidatorStatusPill'

const ValidatorsList = ({ validators, recentGroups }) => {
  return (
    <div className="w-full grid grid-cols-1 divide-y divide-gray-400">
      {validators.map((v) => (
        <div key={v.address} className="border-solid py-2 px-4 flex">
          <div className="w-full">
            <div className="text-base font-medium">
              {animalHash(v.address)} (#{v.number})
            </div>
            <div className="flex items-center space-x-4 h-8">
              <ValidatorFlagLocation geo={v.geo} />
              <ConsensusIndicator
                address={v.address}
                recentGroups={recentGroups}
              />
            </div>
          </div>
          <div className="flex items-center px-4">
            <ValidatorStatusPill status={v.status} />
          </div>
          <div className="flex">
            <Image src="/images/details-arrow.svg" width={10} height={10} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ValidatorsList
