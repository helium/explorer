import { useState } from 'react'
import { Button } from 'antd'

const TruncatedField = ({ key, value }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <p
        className={key}
        id={key}
        style={
          open
            ? {
                paddingBottom: '10px',
              }
            : {
                paddingBottom: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '60ch',
              }
        }
      >
        {value}
      </p>
      <Button size="small" onClick={() => setOpen(!open)}>
        {open ? 'Show less' : 'Show more'}
      </Button>
    </>
  )
}

export default TruncatedField
