import React from 'react'
import { CompositeDecorator } from 'draft-js'

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    },
    callback,
  )
}

const Link = ({ contentState, entityKey, children }) => {
  const { href } = contentState.getEntity(entityKey).getData()
  return (
    <a href={href}>{children}</a>
  )
}

const decorator = new CompositeDecorator([{
  strategy: findLinkEntities,
  component: Link,
}])

export default decorator
