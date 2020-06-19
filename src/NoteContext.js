import React from 'react'

const NoteContext = React.createContext({
  folders:[],
  notes:[],
  DeleteNote: () => {},
})

export default NoteContext