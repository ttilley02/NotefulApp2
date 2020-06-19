import React from "react";
import ValidationError from "../ValidationError";
import "../App.css";
import NoteContext from "../NoteContext";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Config from "../config";

export default class AddNote extends React.Component {
  static contextType = NoteContext;
  static defaultProps = {
    folderList: [
      {
        id: "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
        name: "Important"
      },
      {
        id: "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
        name: "Important"
      }
    ]
  };

  validateNoteName() {
    const name = this.props.state.noteName.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length > 25) {
      return "Name must be less than 25 characters long";
    }
  }

  handleSubmit = event => {
    event.preventDefault();

    let folderIdResult = Object.values(this.props.folderList).find(
      folder => folder.name === this.props.state.noteFolder.value
    );

    const min = 1;
    const max = 10000;
    const generatedId = min + Math.random() * (max - min);
    let newDate = new Date();

    let noteInput = {
      id: generatedId,
      name: this.props.state.noteName.value,
      modified: newDate.toLocaleDateString("en-US"),
      folder_id: folderIdResult.id,
      content: this.props.state.noteContent.value
    };

    fetch(Config.API_ENDPOINT + `api/notes/`, {
      method: "POST",
      body: JSON.stringify(noteInput),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error;
          });
        }
        return res.json();
      })
      .then(() => {
        this.props.clearNoteItems();
        this.props.history.push("/");
      })
      .then(() => {
        this.props.addNote(noteInput);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const folderOptions = Object.keys(this.props.folderList).map(
      (folder, index) => {
        return (
          <option key={index} value={this.props.folderList[folder].name}>
            {this.props.folderList[folder].name}
          </option>
        );
      }
    );

    return (
      <div className="addNote ">
        <form onSubmit={e => this.handleSubmit(e)}>
          <h2>Add Note</h2>
          <div className="note__hint" />
          <div className="form-group">
            <input
              type="text"
              className="folderNote__control"
              name="name"
              id="name"
              placeholder="Note Name..."
              value={this.props.state.noteName.value}
              onChange={this.props.updateAddNoteName}
              required
            />
            {this.props.state.noteName.touched && (
              <ValidationError message={this.validateNoteName()} />
            )}
          </div>
          <div className="note__hint" />
          <div className="form-group">
            <label htmlFor="name" />
            <textarea
              type="text"
              className="folderNote__control"
              name="name"
              id="name"
              placeholder="Content..."
              value={this.props.state.noteContent.value}
              onChange={this.props.updateAddNoteContent}
              required
            />
          </div>

          <select
            className="folderNoteSelect__control"
            id="folderChoice"
            name="Folder"
            onChange={e => this.props.folderSelection(e)}
          >
            <option value="None">Select Folder</option>
            {folderOptions}
          </select>
          <br />

          <button
            className="submitButton"
            type="submit"
            disabled={this.validateNoteName()}
          >
            Submit
          </button>
          <br />
          <br />
          <Link className="goBack" to="/">
            Go Back
          </Link>
        </form>
      </div>
    );
  }
}

AddNote.propTypes = {
  updateAddNoteName: PropTypes.func,
  updateAddNoteContent: PropTypes.func,
  clearNoteItems: PropTypes.func,
  state: PropTypes.object,
  folderList: PropTypes.array,
  folderSelection: PropTypes.array
};
