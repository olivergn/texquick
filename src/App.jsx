import { useEffect, useRef, useState } from 'react'
import { BlockMath } from 'react-katex';
import './App.css'
import 'katex/dist/katex.min.css'

function App() {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [elements, setElements] = useState([]);
  const [isEditing, setEditing] = useState([]);

  const notesRef = useRef(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

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
    const newElement = { mode, content: input };
    setElements([...elements, newElement]);
    setEditing([...isEditing, false]);
    setInput("");
  }

  function handleDelete(index) {
    const newElements = elements.filter((_, i) => (i != index));
    const newEditing = isEditing.filter((_, i) => (i != index));
    setElements(newElements);
    setEditing(newEditing);
  }

  function handleEdit(index) {
    const newEditing = [...isEditing];
    newEditing[index] = !newEditing[index];
    setEditing(newEditing);
  }

  function renderNote(el, i) {
    let content;

    if (el.mode == 'math') {
      el.content = parseMath(el.content);
      content = <BlockMath math={el.content} />;
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

    return isEditing[i] ? (
      <div key={i} className='note-container'>
        <div className='note-item'>
          <input type="text" className='edit-input' value={el.content} />
        </div>
        <div className='button-container'>
          <button className='note-button' onClick={() => handleEdit(i)}>Edit</button>
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
      <div id="bg-left"></div>
      <div id="bg-right"></div>

      <div className='notes-container'>
        {elements.map((el, i) => renderNote(el, i))}
        <div id='notes-ending' ref={notesRef}></div>
      </div>

      <form onSubmit={handleSubmit}>
      <div className="toolbar">
        <select name="modes" id="modes" className="mode-select" onChange={handleModeChange}>
          <option value="text">Text</option>
          <option value="math">Math</option>
        </select>
        <input type="text" className="text-input" value={input} onChange={handleInputChange}/>
        <button type='submit' className="text-submit">Send</button>
      </div>
      </form>
    </>
  )
}

export default App
