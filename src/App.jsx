import { useEffect, useRef, useState } from 'react'
import { BlockMath } from 'react-katex';
import './App.css'
import 'katex/dist/katex.min.css'

function App() {
  /* Constants */

  const [notepads, setNotepads] = useState(() => {
    const stored = localStorage.getItem('notepads');
    return stored ? JSON.parse(stored) : ["Default"];
  });
  const [currentNotepad, setCurrentNotepad] = useState("");
  const [notepadInput, setNotepadInput] = useState("");

  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [elements, setElements] = useState([]);

  const notesRef = useRef(null);

  /* Effects */

  useEffect(() => {
    if (!currentNotepad && notepads.length > 0) {
      setCurrentNotepad(notepads[0]);
    }
  }, []);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [elements]);

  useEffect(() => {
    if (localStorage.getItem(currentNotepad)) {
      setElements(JSON.parse(localStorage.getItem(currentNotepad)));
    } else {
      setElements([]);
    }
  }, [currentNotepad]);

  /* Notepads */

  function handleNotepadChange(e) {
    const selected = e.target.value;
    setCurrentNotepad(selected);
  }

  function handleNotepadInputChange(e) {
    setNotepadInput(e.target.value);
  }

  function handleCreateNotepad() {
    if (notepadInput !== "" && !notepads.includes(notepadInput)) {
      const newNotepads = [...notepads, notepadInput];
      setNotepads(newNotepads);
      localStorage.setItem('notepads', JSON.stringify(newNotepads));
      setNotepadInput("");
    }
  }

  function handleDeleteNotepad() {
    if (notepads.length > 1) {
      const index = notepads.indexOf(currentNotepad);
      const newNotepads = notepads.filter((_, i) => (i != index));
      setNotepads(newNotepads);
      localStorage.setItem('notepads', JSON.stringify(newNotepads));
      setCurrentNotepad(newNotepads[0]);
    }
  }

  function renderOption(notepad, i) {
    return (
      <option key={i} value={notepad}>{notepad}</option>
    )
  }

  /* Notes */

  function parseMath(str) {
    return str.replaceAll("\\[", "\\begin{bmatrix}")
      .replaceAll("\\]", "\\end{bmatrix}")
      .replaceAll("<=", "\\leq ")
      .replaceAll(">=", "\\geq ")
      .replaceAll("!=", "\\neq ")
      .replaceAll("<->", "\\leftrightarrow ")
      .replaceAll("->", "\\rightarrow ")
      .replaceAll("<-", "\\leftarrow ")
      .replaceAll("||", "\\lVert ")
      .replaceAll("|", "\\lvert ");
  }

  function handleModeChange(e) {
    setMode(e.target.value);
  }

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newElement = { mode, content: input, isEditing: false, editValue: input };
    const newElements = [...elements, newElement];
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
    setInput("");
  }

  function handleDelete(index) {
    const newElements = elements.filter((_, i) => (i != index));
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
  }

  function handleEdit(index) {
    const newElements = [...elements];
    newElements[index].isEditing = !newElements[index].isEditing;
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
  }

  function handleEditChange(index, value) {
    const newElements = [...elements];
    newElements[index].editValue = value;
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
  }

  function handleEditSubmit(index) {
    const newElements = [...elements];
    newElements[index].content = elements[index].editValue;
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
    handleEdit(index);
  }

  function handleEditDiscard(index) {
    const newElements = [...elements];
    newElements[index].editValue = elements[index].content;
    setElements(newElements);
    localStorage.setItem(currentNotepad, JSON.stringify(newElements));
    handleEdit(index);
  }

  function handleClear() {
    setElements([]);
    localStorage.removeItem(currentNotepad);
  }

  function renderNote(el, i) {
    let content;

    if (el.mode == 'math') {
      content = <BlockMath math={parseMath(el.content)} />;
    } else {
      if (el.content.startsWith("####")) {
        content = <h4>{el.content.replace("####", "")}</h4>;
      } else if (el.content.startsWith("###")) {
        content = <h3>{el.content.replace("###", "")}</h3>;
      } else if (el.content.startsWith("##")) {
        content = <h2>{el.content.replace("##", "")}</h2>;
      } else if (el.content.startsWith("#")) {
        content = <h1>{el.content.replace("#", "")}</h1>;
      } else {
        content = <p>{el.content}</p>;
      }
    }

    return elements[i].isEditing ? (
      <div key={i} className='note-container'>
        <div className='note-item'>
          <input type="text" className='edit-input' value={elements[i].editValue} onChange={(e) => handleEditChange(i, e.target.value)} />
        </div>
        <div className='button-container'>
          <button className='note-button' onClick={() => handleEditSubmit(i)}>Confirm</button>
          <button className='note-button' onClick={() => handleEditDiscard(i)}>Discard</button>
          <button className='note-button' onClick={() => handleDelete(i)}>Delete</button>
        </div>
      </div>
    ) : (
      <div key={i} className='note-container'>
        <div className='note-item'>
          {content}
        </div>
        <div className='button-container'>
          <button className='note-button' onClick={() => handleEdit(i)}>Edit</button>
          <button className='note-button' onClick={() => handleDelete(i)}>Delete</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div id='bg-left'></div>
      <div id='bg-right'></div>

      <div className='sidebar-container'>
        <select name='notepads' id='notepad-select' className='med-button' value={currentNotepad} onChange={handleNotepadChange}>
        {notepads.map((notepad, i) => renderOption(notepad, i))}
      </select>
      <input type="text" id='notepad-input' className='med-button' value={notepadInput} onChange={handleNotepadInputChange} />
      <button id='notepad-create' className='med-button' onClick={handleCreateNotepad}>Create Notepad</button>
      <button id='notepad-delete' className='med-button' onClick={handleDeleteNotepad}>Delete Notepad</button>
      </div>

      <div className='notes-container'>
        {elements.map((el, i) => renderNote(el, i))}
        <div id='notes-ending' ref={notesRef}></div>
      </div>

      <button id='clear-button' className='big-button' onClick={handleClear}>Clear</button>

      <form onSubmit={handleSubmit}>
        <div className='toolbar'>
          <select name='modes' id='mode-select' className='big-button' onChange={handleModeChange}>
            <option value="text">Text</option>
            <option value="math">Math</option>
          </select>
          <input type='text' id='text-input' value={input} onChange={handleInputChange} />
          <button type='submit' id='text-submit' className='big-button'>Send</button>
        </div>
      </form>
    </>
  )
}

export default App
