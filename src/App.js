import React from "react";
import "./App.css";
import NoteListNav from "./NoteListNav/NoteListNav";
import NoteListMain from "./NoteListMain/NoteListMain";
import NotePageMain from "./NotePageMain/NotePageMain";
import NotePageNav from "./NotePageNav/NotePageNav";
import { Route, Link } from "react-router-dom";
import NoteContext from "./NoteContext";
import AddNote from "./AddNote/AddNote";
import AddFolder from "./AddFolder/AddFolder";
import Config from "./config";

class App extends React.Component {
  static contextType = NoteContext;

  state = {
    folders: [],
    notes: [],
    noteName: {
      value: "",
      touched: false
    },
    noteContent: {
      value: "",
      touched: false
    },
    noteFolder: {
      value: "",
      touched: false
    },
    folderName: {
      value: "",
      touched: false
    }
  };

  componentDidMount() {
    //fetch request for folders
    fetch(Config.API_ENDPOINT + "api/folders")
      .then(response => response.json())
      .then(data => {
        //store response in this.state.folders

        this.setState({ folders: data });
      });
    fetch(Config.API_ENDPOINT + "api/notes")
      .then(response => response.json())
      .then(data => {
        //store response in this.state.folders

        this.setState({ notes: data });
      });
  }

  deleteNotefromPage = id => {
    this.setState({ notes: this.state.notes.filter(note => note.id !== id) });
  };

  addFolder = newFolder => {
    const updatedList = this.state.folders;
    updatedList.push(newFolder);
    this.setState({ folders: updatedList });
  };

  addNote = newNote => {
    const updatedList = this.state.notes;
    updatedList.push(newNote);
    this.setState({ notes: updatedList });
  };

  updateAddNoteName = event => {
    this.setState({ noteName: { value: event.target.value, touched: true } });
  };

  updateAddNoteContent = event => {
    this.setState({
      noteContent: { value: event.target.value, touched: true }
    });
  };

  folderSelection = event => {
    this.setState({ noteFolder: { value: event.target.value, touched: true } });
  };

  updateAddFolderName = event => {
    this.setState({ folderName: { value: event.target.value, touched: true } });
  };

  clearNoteItems = () => {
    this.setState({
      noteName: { value: "", touched: false },
      noteContent: { value: "", touched: false }
    });
  };

  clearFolderName = () => {
    this.setState({ folderName: { value: "", touched: false } });
  };

  render() {
    let contextValue = {
      notesAndFolderInfo: this.state,
      deleteNotefromPage: this.deleteNotefromPage,
      folders: this.state.folders,
      notes: this.state.notes,
      history: this.history
    };

    return (
      <NoteContext.Provider value={contextValue}>
        <div className="App">
          <header className="App-header">
            <h1>
              <Link to={"/"}>Noteful</Link>
            </h1>
          </header>

          <aside>
            {/* Show/hide components in SIDEBAR section based on route */}
            {/* Main Route */}
            <Route
              exact
              path="/"
              render={() => (
                // Pass in the entire folders array from state as a prop
                <NoteListNav folders={this.state.folders} />
              )}
            />
            {/* Folder Route */}
            <Route
              exact
              path="/folders/:folder_id" //:folder_id will be the id of the folder in the url - for example localhost:3000/folders/kjdsh1234321ikdw
              render={props => (
                // folders prop will be entire folders array from state
                // selected prop will be the id from the url (:folder_id)
                <NoteListNav
                  folders={this.state.folders}
                  selected={props.match.params.folder_id}
                />
              )}
            />
            {/* Note Route */}
            <Route
              exact
              path="/notes/:noteId"
              render={props => (
                // folders prop will be entire folders array from state
                // selected prop will be the id from the url (:folder_id)
                <NotePageNav
                  folders={this.state.folders}
                  notes={this.state.notes}
                  state={this.state}
                  selected={props.match.params.noteId}
                />
              )}
            />
          </aside>
          <main>
            {/* Show/hide components in 'MAIN' section based on route */}
            {/* Main Route */}
            <Route
              exact
              path="/"
              render={({ history }) => (
                // 'notes' prop will be entire notes array from state
                <NoteListMain
                  notes={this.state.notes}
                  history={history}
                  state={this.state}
                />
              )}
            />
            {/* Folder Route */}
            <Route
              exact
              path="/folders/:folder_id" //:folder_id will be the id of the folder in the url - for example localhost:3000/folders/kjdsh1234321ikdw
              render={props => {
                return (
                  /*
                  'notes' prop will be all the notes that have a folder_id
                  that matches the value passed as :folder_id in the url
                  */
                  <NoteListMain
                    notes={this.state.notes.filter(
                      note =>
                        note.folder_id === Number(props.match.params.folder_id)
                    )}
                  />
                );
              }}
            />
            {/* Note Route */}
            <Route
              exact
              path="/notes/:noteId"
              render={props => {
                return (
                  <NotePageMain
                    notes={this.state.notes}
                    selected={props.match.params.noteId}
                    state={this.state}
                  />
                );
              }}
            />
            {/* Add Note Route */}
            <Route
              exact
              path="/AddNote"
              render={({ history }) => {
                return (
                  <AddNote
                    updateAddNoteName={this.updateAddNoteName}
                    updateAddNoteContent={this.updateAddNoteContent}
                    clearNoteItems={this.clearNoteItems}
                    state={this.state}
                    folderList={this.state.folders}
                    folderSelection={this.folderSelection}
                    addNote={this.addNote}
                    history={history}
                  />
                );
              }}
            />
            <Route
              exact
              path="/AddFolder"
              render={({ history }) => {
                return (
                  <AddFolder
                    updateAddFolderName={this.updateAddFolderName}
                    state={this.state}
                    clearFolderName={this.clearFolderName}
                    addFolder={this.addFolder}
                    history={history}
                  />
                );
              }}
            />
          </main>
        </div>
      </NoteContext.Provider>
    );
  }
}

export default App;
