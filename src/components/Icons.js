// Refacto: OK 2018-06-18
import React from 'react'

/**
 * An icon (emoji) as a button.
 */
const Icon = ({ gridArea, label, icon, ...props }) => (
  <span
    role="button"
    aria-label={label}
    style={{
      gridArea,
      alignSelf: 'center',
      fontSize: '2.25rem',
      cursor: 'pointer',
      textAlign: 'center'
    }}
    {...props}
  >
    {icon}
  </span>
)

const EditIcon = props => (
  <Icon label="edit" gridArea="edit" title="Edit" {...props} icon="✏" />
)

const SaveIcon = props => (
  <Icon label="save" gridArea="edit" title="Save" {...props} icon="💾" />
)

const DeleteIcon = props => (
  <Icon label="delete" gridArea="delete" title="Delete" {...props} icon="✕" />
)

export { EditIcon, SaveIcon, DeleteIcon }
