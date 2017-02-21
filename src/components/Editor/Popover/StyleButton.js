import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class StyleButton extends Component {
  constructor(props) {
    super(props)
    this.onToggle = (e) => {
      e.preventDefault()
      props.onToggle(props.style)
    }
  }

  render() {
    const { active, label, className } = this.props
    const cls = classnames({
      'active': active,
      [className]: className
    })

    return (
      <button className={cls} onMouseDown={this.onToggle}>{label}</button>
    )
  }
}

StyleButton.propTypes = {
  style: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
}

export default StyleButton
