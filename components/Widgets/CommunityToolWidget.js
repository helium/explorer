import classNames from 'classnames'
import Widget from './Widget'

const CommunityToolWidget = ({ title, description, category, url }) => {
  return <Widget title={category} value={title} subtitle={description} />
}

export default CommunityToolWidget
