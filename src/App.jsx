import { useEffect, useRef, useState } from 'react'
import { BlockMath } from 'react-katex';
import './App.css'
import 'katex/dist/katex.min.css'

function App() {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [elements, setElements] = useState([]);

  const notesRef = useRef(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  function parseMath(str) {
    return str.replace("\\[", "\\begin{bmatrix}")
    .replace("\\]", "\\end{bmatrix}");
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
    setInput("");
  }

  function renderNote(el, i) {
    if (el.mode == 'math') {
      el.content = parseMath(el.content);
      return (<div key={i} className='note-item'><BlockMath math={el.content} /></div>);
    } else {
      return (<div key={i} className='note-item'><p>{el.content}</p></div>);
    }
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
