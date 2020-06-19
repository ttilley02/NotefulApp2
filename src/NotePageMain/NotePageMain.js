import React from "react";
import Note from "../Note/Note";
import NoteContext from "../NoteContext";

export default class NotePageMain extends React.Component {
  static contextType = NoteContext;

  render() {
    // Find the note that has the same id from the url (:noteId)
    let selectedNote = this.props.notes.find(
      note => note.id === Number(this.props.selected)
    );
    console.log(selectedNote);
    return (
      <div className="Main noteContent">
        <h2>Notes</h2>
        <Note
          id={selectedNote.id}
          folder_id={selectedNote.folder_id}
          name={selectedNote.name}
          modified={selectedNote.modified}
          history={this.props.history}
        />
        <p>{selectedNote.content}</p>
      </div>
    );
  }
}
