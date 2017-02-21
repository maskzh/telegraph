import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Editor, EditorState, RichUtils } from 'draft-js'
import BlockComponent from './BlockComponent'
import decorator from './decorator'
import Aside from './Aside'
import Popover from './Popover'
import './style.css'

const getSelectedBlockElement = (range) => {
  let node = range.startContainer
  do {
    if (node.getAttribute && node.getAttribute('data-block') === 'true') {
      return node
    }
    node = node.parentNode
  } while (node != null)

  return null
}

const getSelectionRange = () => {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) return null
  return selection.getRangeAt(0)
}

const isParentOf = (elm, maybeParent) => {
  while(elm.parentNode != null && elm.parentNode !== document.body) {
    if (elm.parentNode === maybeParent) return true
    elm = elm.parentNode
  }
  return true
}

class RichEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.onBlur = this._onBlur.bind(this)
    this.onFocus = this._onFocus.bind(this)
    this.blockRender = this._blockRender.bind(this)
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.updateSelection = () => {
      const selectionRange = getSelectionRange()
      if (!selectionRange) return

      const editor = ReactDOM.findDOMNode(this.refs.editor)
      if (!isParentOf(selectionRange.commonAncestorContainer, editor)) return

      if (!this.editorBounds) this.editorBounds = editor.getBoundingClientRect()

      const popover = ReactDOM.findDOMNode(this.refs.popover)
      const aside = ReactDOM.findDOMNode(this.refs.aside)

      const selectedBlock = getSelectedBlockElement(selectionRange)
      if (!selectedBlock) return

      const blockBounds = selectedBlock.getBoundingClientRect()
      const rangeBounds = selectionRange.getBoundingClientRect()

      if (!selectionRange.commonAncestorContainer.length) {
        const asideLeft = - aside.clientWidth
        const asideTop = (blockBounds.top - this.editorBounds.top)
          + ((blockBounds.bottom - blockBounds.top) / 2)
          - (25 / 2)

        aside.style.left = `${asideLeft}px`
        aside.style.top = `${asideTop}px`
      }

      if (!selectionRange.collapsed) {
        const popoverWidth = popover.clientWidth
        const popoverHeight = popover.clientHeight

        const rangeWidth = rangeBounds.right - rangeBounds.left
        const popoverTop = (rangeBounds.top - this.editorBounds.top)
          - popoverHeight
          - 3
        const popoverLeft = (rangeBounds.left - this.editorBounds.left)
          + (rangeWidth / 2)
          - (popoverWidth / 2)

        // TODO: 样式更改后 popover，定位有问题
        popover.style.left = `${popoverLeft}px`
        popover.style.top = `${popoverTop}px`
      }
    }
  }

  componentDidUpdate() {
    this.updateSelection()
  }

  _isContentBlockEmpty() {
    const { editorState } = this.props
    const selection = editorState.getSelection()
    return !(editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getLength())
  }

  _blockRender(contentBlock) {
    if (contentBlock.getType() === 'atomic') {
      return { component: BlockComponent, editable: false }
    }
    return null
  }

  _handleKeyCommand(command) {
    const { editorState, onChange } = this.props
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      onChange(newState)
      return true
    }
    return false
  }

  _onFocus() {
    if (this.props.readOnly) return
    this.refs.editor.focus()
  }

  _onBlur(...arg) {
    if (this.props.onBlur) this.props.onBlur.apply(this, arg)
  }

  render() {
    const { onChange, ...others } = this.props

    let { editorState } = this.props
    if (!editorState) {
      editorState = EditorState.createEmpty(decorator)
      onChange(editorState)
    }

    return (
      <div className="Editor-root" onClick={this.onFocus}>
        <Aside
          ref="aside"
          className="Editor-aside"
          editorState={editorState}
          updateEditorState={onChange}
          onEditorFocus={this.onFocus}
        />
        <Popover
          ref="popover"
          className="Editor-popover"
          editorState={editorState}
          updateEditorState={onChange}
        />
        <Editor
          ref="editor"
          className="Editor-editor"
          blockRendererFn={this.blockRender}
          handleKeyCommand={this.handleKeyCommand}
          {...others}
          editorState={editorState}
          onChange={onChange}
          onBlur={this.onBlur}
        />
      </div>
    )
  }
}

RichEditor.propTypes = {
  blockTypes: PropTypes.object,
  readOnly: PropTypes.bool,
}

export default RichEditor
