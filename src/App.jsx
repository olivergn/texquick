import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [elements, setElements] = useState([]);

  function handleModeChange(e) {
    setMode(e.target.value);
  }

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    console.log(input); // TEST
    const newElement = { mode, content: input };
    setElements([...elements, newElement]);
    setInput("");
  }

  return (
    <>
      <div id="bg-left"></div>
      <div id="bg-right"></div>

      <div className='notes-container'>
        {elements.map((el, i) => (
          <p key={i} className='note-item'>{el.content}</p>
        ))}
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
