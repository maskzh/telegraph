import { Map } from 'immutable'
import { DefaultDraftBlockRenderMap } from 'draft-js'

const blockRenderMap = Map({
  'atomic': {
    element: 'div'
  }
})

export default DefaultDraftBlockRenderMap.merge(blockRenderMap)
