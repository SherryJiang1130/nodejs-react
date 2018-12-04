import React from 'react'
import ReactDOM from 'react-dom'
import { logApi } from '../api/index'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { list: [], filterVal: '' }
    this.remove = this.remove.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {}

  remove(id) {
    const { initList } = this.props
    logApi
      .remove(id)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          initList()
        }
      })
  }
  onChange(val) {
    const {filterList} =this.props
    filterList(val)
  }

  render() {
    const { list, filterVal } = this.state
    const { logList, clickTitle,filterList } = this.props
    const logs = logList ? logList : list
    return (
      <div>
        <h2>Editor</h2>
        <div className="filterInput">
          <input
            type="text"
            onChange={e => {
              filterList(e.target.value)
            }}
          />
        </div>

        <ul>
          {logs.map(item => {
            return (
              <li key={item.id} className="liStyle">
                <a href="#" onClick={e => clickTitle(item)}>
                  {item.title}
                </a>
                <span className="remove" onClick={e => this.remove(item.id)}>
                  删除
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Sidebar
