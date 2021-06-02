import Checklist from '../InfoBox/HotspotDetails/Checklist'

const ChecklistWidget = ({ hotspot, witnesses, loading, witnessesLoading }) => {
  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <Checklist
        hotspot={hotspot}
        witnesses={witnesses}
        loading={loading}
        witnessesLoading={witnessesLoading}
      />
    </div>
  )
}
export default ChecklistWidget
