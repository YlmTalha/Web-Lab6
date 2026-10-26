import { useEffect, useReducer, useState } from 'react'
import { fetchPosts } from './api/postsApi'
import { postsReducer, initialState } from './reducer/postsReducer'
import FilterForm from './components/FilterForm'
import PostList from './components/PostList'

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState)
  const [filter, setFilter] = useState('')

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

  const filteredPosts = state.posts.filter((post) =>
    post.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Post Dashboard</h1>

      <FilterForm value={filter} onChange={setFilter} />

      {state.loading && <p>Loading posts...</p>}

      {!state.loading && state.error && (
        <p>Could not load posts: {state.error}</p>
      )}

      {!state.loading && !state.error && filteredPosts.length === 0 && (
        <p>No posts found.</p>
      )}

      {!state.loading && !state.error && filteredPosts.length > 0 && (
        <PostList posts={filteredPosts} />
      )}
    </div>
  )
}

export default App
