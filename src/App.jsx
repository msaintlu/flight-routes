const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

function App() {

  return (
    <div className="main-container">

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: "bolder", fontSize: 32 }}>
          Where would you draw the line?
        </p>
        <p style={{ fontSize: 18, marginTop: -25 }}>
          Guess the correlation
        </p>
      </div>

      <div className="line" />

    </div>
  )
}

export default App
