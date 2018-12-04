import '../css/main.less'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertFromRaw,
  convertToRaw
} from 'draft-js'
import { ChromePicker } from 'react-color'
import { logApi } from '../api/index'
import Sidebar from './sideBar'
import { InlineStyleControls, BlockStyleControls } from './styleController'

// Custom overrides for "code" style.

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    case 'COLOR':
      return 'RichEditor-color'
    case 'LEFT':
      return 'align-left'
    case 'CENTER':
      return 'align-center'
    case 'RIGHT':
      return 'align-right'
    default:
      return null
  }
}

function forceRender() {
  const currentState = store.getState();
  const content = currentState.editor.editorState.getCurrentContent();
  const newEditorState = EditorState.createWithContent(content, new CompositeDecorator([]));

  store.dispatch({
    type: UPDATE_EDITOR_STATE,
    payload: newEditorState
  });
}

class RichEditorExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      title: '',
      logList: [],
      baseList: [],
      editStatue: true,
      editContent: '',
      editId: '',
      bgcolor: '',
      displayColorPicker: false,
      someValueChanged :false,
      styleMap: {
        CODE: {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
          fontSize: 16,
          padding: 2
        },
        COLOR: {
          color: '#E68989'
        }
      }
    }

    this.onChange = editorState => this.setState({ editorState })
    this.handleKeyCommand = this._handleKeyCommand.bind(this)
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this)
    this.toggleBlockType = this._toggleBlockType.bind(this)
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    this.add = this.add.bind(this)
    this.edit = this.edit.bind(this)
    this.save = this.save.bind(this)
    this.changeTitle = this._changeTitle.bind(this)
    this.handleClick = this._handleClick.bind(this)
    this.handleClose = this._handleClose.bind(this)
    this.handleChangeColor = this._handleChangeColor.bind(this)
  }
  componentDidMount() {
    this.initList()
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }
  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      )
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState)
      }
      return
    }
    return getDefaultKeyBinding(e)
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    )
  }

  _changeTitle(val) {
    this.setState({
      title: val
    })
  }
  _handleChangeColor(color) {
    let obj = this.state.styleMap
    obj.COLOR = color.hex
    this.setState({ bgcolor: color.hex, styleMap: obj,someValueChanged :true })
  
  }
  add() {
    this.setState({
      title: '',
      editStatue: false,
      editContent: '',
      editorState: EditorState.createEmpty(),
      editId: ''
    })
  }
  edit() {
    this.setState({
      editStatue: false
    })
  }
  save() {
    let self = this
    if (this.state.title == null || this.state.title == '') {
      alert('请输入标题')
      return
    }
    var content = convertToRaw(this.state.editorState.getCurrentContent())
    let type = this.state.editId == '' ? 'create' : 'modify'
    this.api(type, {
      title: this.state.title,
      content: content,
      id: this.state.editId
    }).then(function(res) {
      if (res.success) {
        self.initList()
      }
    })
  }
  initList() {
    let self = this
    this.api('init').then(function(res) {
      if (res.success) {
        self.setState({
          logList: res.list,
          baseList: res.list
        })
      }
    })
  }
  api(type, param) {
    return logApi[type](param).then(function(response) {
      return response.json()
    })
  }
  clickTitle(item) {
    const blocks = convertFromRaw(item.content)
    if (item) {
      this.setState({
        title: item.title,
        editContent: item.content,
        editStatue: true,
        editorState: EditorState.createWithContent(blocks),
        editId: item.id
      })
    }
    return false
  }
  filterList(val) {
    var list = this.state.baseList
    if (val && val != '') {
      list = this.state.baseList.filter(ele => {
        return ele.title.toLowerCase().indexOf(val.toLowerCase()) > -1
      })
    }

    this.setState({
      logList: list
    })
  }
  _handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  _handleClose() {
    this.setState({ displayColorPicker: false })
  }
  render() {
    const {
      editorState,
      logList,
      editStatue,
      title,
      styleMap,
      someValueChanged 
    } = this.state

    const popover = {
      position: 'absolute',
      zIndex: '2'
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    const forcedState = EditorState.forceSelection(editorState, editorState.getSelection());
    return (
      <div className="wrap">
        <div className="leftMenu">
          <Sidebar
            logList={logList}
            clickTitle={this.clickTitle.bind(this)}
            initList={this.initList.bind(this)}
            filterList={this.filterList.bind(this)}
          />
        </div>
        <div id="container">
          <div className="RichEditor-root">
            <div className="tooltip">
              <button onClick={this.add}>新增</button>&nbsp;
              <button onClick={this.edit}>修改</button>&nbsp;
              <button onClick={this.save}>保存</button>
            </div>
            <div className="styleList">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div className="pickColor">
                <div className="pickColor_div" onClick={this.handleClick} />
                {this.state.displayColorPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={this.handleClose} />
                    <ChromePicker
                      color={this.state.bgcolor}
                      onChange={this.handleChangeColor}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className={className}
              onClick={this.focus}
              style={{ backgroundColor: this.state.bgcolor }}
            >
              <div className="fileTitle">
                标题：
                <input
                  type="text"
                  disabled={editStatue}
                  value={title}
                  onChange={e => this.changeTitle(e.target.value)}
                />
              </div>
              <Editor
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={someValueChanged ? forcedState : editorState}
                handleKeyCommand={this.handleKeyCommand}
                keyBindingFn={this.mapKeyToEditorCommand}
                onChange={this.onChange}
                // placeholder="Tell a story..."
                ref="editor"
                spellCheck={true}
                readOnly={editStatue}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<RichEditorExample />, document.getElementById('app'))
