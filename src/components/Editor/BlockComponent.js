import React, { PropTypes } from 'react'

const Image = ({ src }) =>
  <img src={src} style={{ maxWidth: '100%' }} role="presentation" />

const Video = ({ src, width = '100%', height = 'auto' }) =>
  <video controls src={src} width={width} height={height} />

const Iframe = ({ src, width = '100%', height = 'auto' }) =>
  <iframe src={src} width={width} height={height} style={{ minHeight: '360' }} frameBorder="0" allowFullScreen />

const BlockComponent = ({ contentState, block }) => {
  const entity = contentState.getEntity(block.getEntityAt(0))
  const { src } = entity.getData()
  const type = entity.getType()

  let media = null
  if (type === 'image') {
    media = <Image src={src} />
  } else if (type === 'video') {
    media = <Video src={src} />
  } else if (type === 'iframe') {
    media = <Iframe src={src} />
  }

  return media
}

BlockComponent.propTypes = {
  contentState: PropTypes.object,
  block: PropTypes.object,
}

export default BlockComponent
