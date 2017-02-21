import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { AtomicBlockUtils, EditorState } from 'draft-js'
import classnames from 'classnames'
import './style.css'

function getFigureValueByUrl(url) {
  let match = url.match(/src=['"]?([^'"]*)['"]?/i)
  if (match) return { type: 'iframe', src: match[1] }

  match = url.match(/^data:(image\/gif|image\/jpe?g|image\/png|video\/mp4);base64,(.*)$/)
  if (match) {
    if (match[1].substr(0, 6) === 'video/') return { type: 'video', src: url }
    return { type: 'image', src: url }
  }

  match = url.match(/^(https?):\/\/\S+/i)
  if (match) {
    const anchor = document.createElement('a')
    anchor.href = url
    if (anchor.pathname.match(/\.(jpe?g|png|gif|mp4)$/i)) {
      if (match[1] === 'mp4') return { type: 'video', src: url }
      return { type: 'image', src: url }
    }
  }
  return false
}

class Aside extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showURLInput: false,
      urlValue: '',
    }
    this.prompt = this._prompt.bind(this)
    this.onURLBlur = this._onURLBlur.bind(this)
    this.onURLChange = this._onURLChange.bind(this)
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this)
    this.isEmptyAndFocus = this._isEmptyAndFocus.bind(this)
    this.triggerFile = this._triggerFile.bind(this)
    this.onFileChange = this._onFileChange.bind(this)
  }

  _isEmptyAndFocus() {
    const { editorState } = this.props
    const selection = editorState.getSelection()
    return selection.getHasFocus() && !(editorState
      .getCurrentContent()
      .getBlockForKey(selection.getAnchorKey())
      .getLength())
  }

  _updateEditorState(type, src) {
    const { editorState, updateEditorState } = this.props
    // 插入 Entity 并更新 editorState
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', { src })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
    updateEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '))
  }

  _triggerFile() {
    const fileInput = ReactDOM.findDOMNode(this.refs.file)
    fileInput.click()
  }

  _onFileChange() {
    const self = this
    const fileInput = ReactDOM.findDOMNode(this.refs.file)
    if (fileInput.files != null && fileInput.files[0] != null) {
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/upload/upload-image', true)
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          self._updateEditorState('image', result.data.url)
          setTimeout(() => self.props.onEditorFocus(), 0)
        }
      }
      const data = new FormData()
      data.append('upfile', fileInput.files[0])
      data.append('access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjgyNSwiZXhwIjoxODAyOTY3Njg2fQ.H3qmfLvgSy7fJYquGQH6Rq066-tnz-v6GxjmipHC0Qo')

      xhr.send(data)
    }
  }

  _prompt() {
    this.setState({
      showURLInput: true,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0)
    })
  }

  _confirm(e) {
    e.preventDefault()
    const { onEditorFocus } = this.props
    const { urlValue } = this.state
    const { type, src } = getFigureValueByUrl(urlValue)

    this._updateEditorState(type, src)

    this.setState({
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => onEditorFocus(), 0)
    })
  }

  _onURLChange(e) {
    this.setState({ urlValue: e.target.value })
  }

  _onURLBlur() {
    this.setState({ showURLInput: false, urlValue: '' })
  }

  _onURLInputKeyDown(e) {
    if (e.which === 13) this._confirm(e)
  }

  render() {
    const { className } = this.props
    const { showURLInput, urlValue } = this.state
    const cls = classnames({
      'Editor-aside': true,
      'Editor-aside__appear': this.isEmptyAndFocus(),
      'Editor-aside__showURLInput': showURLInput,
      [className]: className
    })
    return (
      <div className={cls}>
        <div className="Editor-aside-operation">
          <button onMouseDown={this.triggerFile}>
            <i className="iconfont icon-camera" />
          </button>
          <button onMouseDown={this.prompt}>
            <i className="iconfont icon-code" />
          </button>
        </div>
        <div className="Editor-aside-urlInputContainer">
          <input
            ref="url"
            type="text"
            className="Editor-aside-urlInput"
            value={urlValue}
            onChange={this.onURLChange}
            onKeyDown={this.onURLInputKeyDown}
            onClick={(e) => e.stopPropagation()}
            onBlur={this.onURLBlur}
            placeholder="粘贴 优酷、土豆、腾讯视频等提供的通用代码，然后按回车键"
          />
        </div>
        <input
          ref="file"
          type="file"
          className="Editor-aside-fileInput"
          accept="image/gif, image/jpeg, image/jpg, image/png"
          onChange={this.onFileChange}
        />
      </div>
    )
  }
}

Aside.propTypes = {
  editorState: PropTypes.object.isRequired,
  updateEditorState: PropTypes.func.isRequired,
  onEditorFocus: PropTypes.func.isRequired,
}

export default Aside
