function Error({ statusCode }) {
  if (statusCode === 404) {
    return <div>error404</div>
  }
  return <div />
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  if (statusCode >= 500 && statusCode < 600) {
    res.writeHead(302, {
      Location: '/500',
    })
    res.end()
  }

  return { statusCode }
}

export default Error
