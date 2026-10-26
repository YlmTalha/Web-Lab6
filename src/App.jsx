import { useEffect, useReducer } from 'react'
import { fetchPosts } from './api/postsApi'
import { postsReducer, initialState } from './reducer/postsReducer'

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState)

  useEffect(() => {
    let ignore = false

    async function loadPosts() {
      dispatch({ type: 'FETCH_START' })

      try {
        const data = await fetchPosts()
        if (!ignore) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data })
        }
      } catch (error) {
        if (!ignore) {
          dispatch({ type: 'FETCH_ERROR', payload: error.message })
        }
      }
    }

    loadPosts()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div>
      <h1>Post Dashboard</h1>

      {state.loading ? <p>Loading posts...</p> : <p>{state.posts.length} posts loaded.</p>}
    </div>
  )
}

export default App
