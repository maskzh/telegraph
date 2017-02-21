import React, { Component, PropTypes } from 'react'
import { RichUtils } from 'draft-js'
import classnames from 'classnames'
import StyleButton from './StyleButton'
import './style.css'

const DEFAULT_BUTTONS = [
  // { label: 'H1', style: 'header-one', type: 'block' },
  { label: 'H2', style: 'header-two', type: 'block' },
  { label: 'H3', style: 'header-three', type: 'block' },
  // { label: 'H4', style: 'header-four', type: 'block' },
  // { label: 'H5', style: 'header-five', type: 'block' },
  // { label: 'H6', style: 'header-six', type: 'block' },
  { label: 'Blockquote', style: 'blockquote', type: 'block' },
  { label: 'UL', style: 'unordered-list-item', type: 'block' },
  { label: 'OL', style: 'ordered-list-item', type: 'block' },
  // { label: 'Code Block', style: 'code-block', type: 'block' },
  { label: 'Bold', style: 'BOLD', type: 'inline' },
  { label: 'Italic', style: 'ITALIC', type: 'inline' },
  { label: 'Underline', style: 'UNDERLINE', type: 'inline' },
  // { label: 'Monospace', style: 'CODE', type: 'inline' },
]

class Popover extends Component {
  constructor(props) {
    super(props)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
  }

  _toggleBlockType(blockType) {
    const { editorState, updateEditorState } = this.props
    updateEditorState(RichUtils.toggleBlockType(editorState, blockType))
  }

  _toggleInlineStyle(inlineStyle) {
    const { editorState, updateEditorState } = this.props
    updateEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  render() {
    const {
      editorState,
      buttons = DEFAULT_BUTTONS,
      className,
    } = this.props

    const selection = editorState.getSelection()
    const cls = classnames({
      'Editor-popover': true,
      'Editor-popover__appear': selection.getHasFocus() && !selection.isCollapsed(),
      [className]: className
    })

    // for block
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()

    // for inline
    const currentStyle = editorState.getCurrentInlineStyle()

    return (
      <div className={cls}>
        {buttons.map((button) =>
          button.type === 'block' ? (
            <StyleButton
              key={button.label}
              active={button.style === blockType}
              label={button.label}
              onToggle={this.toggleBlockType}
              style={button.style}
            />
          ) : (
            <StyleButton
              key={button.label}
              active={currentStyle.has(button.style)}
              label={button.label}
              onToggle={this.toggleInlineStyle}
              style={button.style}
            />
          )
        )}
      </div>
    )
  }
}

Popover.propTypes = {
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
  buttons: PropTypes.array,
  className: PropTypes.string,
}

export default Popover
