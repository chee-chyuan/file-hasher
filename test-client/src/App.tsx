import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { wrap } from 'comlink';

function App() {
  const worker = new Worker(new URL('./file-hasher-worker', import.meta.url), {
    name: 'file-hasher-worker',
    type: 'module',
  });
  const workerApi = wrap<import('./file-hasher-worker').FileHasherWorker>(worker);
  const [ans, setAns] = useState(0);

  async function test() {
    await workerApi.testAllFlow();
    // const start = performance.now();
    // const diff_js = await workerApi.get_play_diff();
    // console.log('in between', diff_js);
    // console.log('btw', performance.now() - start);
    // const proof = await workerApi.prove_play();
    // console.log('ending', performance.now() - start);
    // console.log('outside proof', proof);

    // const verification = await workerApi.verify_play(proof, diff_js);
    // console.log('verified', verification);
    // console.log('time', performance.now() - start);
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {ans}
        <button onClick={test}>test</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
