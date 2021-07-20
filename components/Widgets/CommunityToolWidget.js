import classNames from 'classnames'
import Widget from './Widget'

const CategoryPillSection = ({ tags }) => {
  return (
    <div className="flex items-center space-x-2">
      {tags.map((tag) => {
        return (
          <div
            className={classNames('px-2 py-0.5 rounded-full text-xs', {
              'bg-navy-50 text-navy-400': tag === 'Monitoring',
              'bg-purple-50 text-purple-500': tag === 'Data Export',
              'bg-yellow-50 text-yellow-800': tag === 'Planning',
              // TODO: add more tag options
            })}
          >
            {tag}
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
      linkTo={url}
    />
  )
}

export default CommunityToolWidget
