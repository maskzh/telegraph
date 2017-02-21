import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import Editor from './components/Editor'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      author: '',
      editorState: EditorState.createEmpty(),
      canEdit: true,
    }
    this.onTitleChange = (e) => this.setState({ title: e.target.value })
    this.onAuthorChange = (e) => this.setState({ author: e.target.value })
    this.onEditorChange = (editorState) => this.setState({ editorState })
  }

  render() {
    return (
      <div className="App">
        <main className="App-main">
          <header className="App-header">
            <h1>
              {this.state.title && <label htmlFor="title">标题</label>}
              <input
                id="title"
                type="text"
                className="input__lg"
                value={this.state.title}
                onChange={this.onTitleChange}
                placeholder="标题"
                autoComplete="off"
                readOnly={!this.state.canEdit}
              />
            </h1>
            <address>
              {this.state.author && <label htmlFor="author">作者</label>}
              <input
                id="author"
                type="text"
                className="input__sm"
                value={this.state.author}
                onChange={this.onAuthorChange}
                placeholder="你的名字"
                autoComplete="off"
                readOnly={!this.state.canEdit}
              />
            </address>
          </header>
          <article className="App-article">
            <Editor
              editorState={this.state.editorState}
              onChange={this.onEditorChange}
              placeholder="开始书写..."
            />
          </article>
          <aside className="App-aside">
            {/* <button className="button">编辑</button> */}
            <button className="button">发布</button>
          </aside>
        </main>
      </div>
    )
  }
}

export default App
