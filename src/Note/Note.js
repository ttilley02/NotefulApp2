import React from "react";
import { Link } from "react-router-dom";
import NoteContext from "../NoteContext";
import PropTypes from "prop-types";
import "../App.css";
import note from "./note.png";
import deleteIcon from "./deleteIcon.png";
import Config from "../config";

// Found this on stack overflow: https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
function formatDate(date) {
  var monthNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + "/" + day + "/" + year;
}

export default class Note extends React.Component {
  static contextType = NoteContext;

  DeleteNote = id => {
    fetch(Config.API_ENDPOINT + `api/notes/` + id, {
      method: "DELETE",
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
        this.props.history.push("/");
      })
      .then(() => {
        // call the callback when the request is successful
        // this is where the App component can remove it from state
        this.context.deleteNotefromPage(id);
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const modified = formatDate(new Date(this.props.modified));
    return (
      <li className="Note">
        <img className="noteIcon" src={note} alt="folderIcon" />
        <Link className="noteName" to={`/notes/${this.props.id}`}>
          {this.props.name}
        </Link>
        <div>
          <p>Updated: {modified}</p>

          <button
            className="deleteButtonContainer"
            onClick={() => {
              this.DeleteNote(this.props.id);
            }}
          >
            <img className="deleteButton" src={deleteIcon} alt="deletebutton" />
          </button>
        </div>
      </li>
    );
  }
}

Note.propTypes = {
  id: PropTypes.number,
  folder_id: PropTypes.number,
  name: PropTypes.string,
  modified: PropTypes.string,
  onDeleteNote: PropTypes.func,
  history: PropTypes.object
};
