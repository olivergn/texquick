# TeXQuick
> A lightweight, LaTeX-powered note-taker.

## General information
This project was created to solve a problem I encountered during my university studies. I needed a way to quickly write down mathematical formulae and equations, but paper wasn't always available, writing `.tex` files was clunky and slow, and word processor equation editors felt too finicky. So, I created TeXQuick, powered by KaTeX, for a fast, lightweight, low-overhead alternative, with built-in support for shortcuts to make producing expressions even more efficient.

## Current features
- Users can write both text and math input, which is dynamically added via DOM manipulation.
- Notes can be deleted at will if errors are made or they are no longer needed.
- The content of notes can be edited, and edits can be discarded or confirmed.
- Markdown-style #headers can be used to emphasise sections of notes.
- User math input is automatically embedded as LaTeX expressions via KaTeX.
- Shortcuts help speed up LaTeX expressions for matrices, inequalities, and logic.

## Planned features
- Support for drag-and-drop rearranging notes.
- Exporting notes to `.tex` or to PDF.
- More shortcuts for LaTeX expressions.

## Technologies used
- **Node.js**
- **Vite**
- **React**
- **KaTeX**
