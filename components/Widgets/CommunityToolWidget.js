import classNames from 'classnames'
import Widget from './Widget'

const CategoryPillSection = ({ tags }) => {
  return (
    <div className="flex items-center space-x-2">
      {tags?.map((tag) => {
        return (
          <div
            className={classNames(
              'px-2 py-0.5 rounded-full text-xs font-medium',
            )}
            style={{
              backgroundColor: tag.backgroundColor,
              color: tag.foregroundColor,
            }}
          >
            {tag.label}
          </div>
        )
      })}
    </div>
  )
}

const CommunityToolWidget = ({ title, description, tags, url }) => {
  return (
    <Widget
      span={2}
      title={<CategoryPillSection tags={tags} />}
      value={title}
      subtitle={description}
      longSubtitle
      linkTo={url}
    />
  )
}

export default CommunityToolWidget
