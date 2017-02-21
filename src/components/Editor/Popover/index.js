import React, { Component, PropTypes } from 'react'
import { RichUtils } from 'draft-js'
import classnames from 'classnames'
import StyleButton from './StyleButton'
import './style.css'

const DEFAULT_BUTTONS = [
  { label: 'Bold', style: 'BOLD', type: 'inline', icon: <i className="iconfont icon-bold" /> },
  { label: 'Italic', style: 'ITALIC', type: 'inline', icon: <i className="iconfont icon-italic" /> },
  { label: 'H2', style: 'header-two', type: 'block', icon: <i className="iconfont icon-t" /> },
  { label: 'H3', style: 'header-three', type: 'block', icon: <i className="iconfont icon-st" /> },
  { label: 'Blockquote', style: 'blockquote', type: 'block', icon: <i className="iconfont icon-quote" /> },
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
              icon={button.icon}
              onToggle={this.toggleBlockType}
              style={button.style}
            />
          ) : (
            <StyleButton
              key={button.label}
              active={currentStyle.has(button.style)}
              label={button.label}
              icon={button.icon}
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
