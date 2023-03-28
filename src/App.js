import './App.css';
import React, { useEffect, useState } from 'react';
import { decryptToken, encryptToken } from './utils/handleToken';
import { handleGPT } from './utils/handleGPT';
function App() {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [newToken, setNewToken] = useState('');

  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(
    {
      "role": "user",
      "content": ""
    }
  );

  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // get Token from local storage
    const encryptedToken = localStorage.getItem('encryptedToken');
    if (encryptedToken) {
      // decrypt token
      const token = decryptToken(encryptedToken);
      // console.log('token', token);
      if (token) {
        setToken(token);
      } else {
        // if token is invalid, remove it from local storage
        localStorage.removeItem('encryptedToken');
      }
    }
  }, []);


  const onPromptSubmit = async (content) => {
    // console.log('onPromptSubmit', content);
    setLoading(true);
    var newHistory = [...history];
    newHistory.push({
      "role": "user",
      "content": content
    });

    const res = await handleGPT(newHistory, token);
    if (res) {
      // console.log('res.content::', res.content);
      newHistory.push(res);
      setOutput(res.content);
    } else {
      setError('Something went wrong');
    }
    setHistory(newHistory);
    setCurrent({
      "role": "user",
      "content": ""
    });
    setLoading(false);
  }

  // after 3 seconds, clear error
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);


  return (
    <div className="App">
      {error &&
        <div className="error">
          <span>{error}</span>
        </div>
      }
      <header className="App-header">
        <span>
          {token ? `Welcome To ES GPT Plugin` : 'Please login'}
        </span>
        {token &&
        <button 
          className="reset-token"
          onClick={() => {
            setToken('');
            localStorage.removeItem('encryptedToken');
          }}
        >
          Reset Token
        </button>
        }
      </header>
      <div
        className="App-body"
      >
        {token ? (
          <div
            className="chat-container"
          >
            <div
              className="chat-input"
            >
              <textarea
                cols={50}
                rows={6}
                className='chat-input-textarea'
                value={current?.content}
                onChange={(e) => setCurrent({ ...current, content: e.target.value })}
              />
              <button
                className='chat-input-button'
                onClick={() => {
                  if (current?.content) {
                    onPromptSubmit(current?.content)

                  } else {
                    setError('Prompt is required');
                  }
                }}
              >
                {loading ? 'Loading...' : 'Ask'}
              </button>
            </div>
            <div
              className="chat-output"
            >
              <textarea
                className='chat-output-text'
                cols={50}
                rows={20}
                value={output}
                disabled
              />
              <button
                className='chat-output-button'
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <div
            className="login-container"
          >
            <input
              className="login-input"
              type="password"
              placeholder="New Token"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
            />
            <button
              className="login-button"
              onClick={() => {
                if (newToken) {
                  encryptToken(newToken);
                  setToken(newToken);
                } else {
                  setError('Token is required');
                }
              }}
            >Submit</button>
          </div>
        )}
      </div>
      <footer className="App-footer">
        <span>
          Powered by Everydayseries
        </span>
      </footer>
    </div>
  );
}

export default App;
