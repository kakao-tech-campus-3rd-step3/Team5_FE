import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>DailyQ 프로젝트</h1>
      <p>협업을 위한 깔끔한 시작점입니다.</p>
      <button onClick={() => setCount(count + 1)}>
        카운트: {count}
      </button>
    </div>
  )
}

export default App
