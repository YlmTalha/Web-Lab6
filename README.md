# Assignment 6 - Post Dashboard

Talha Yılmaz - Web Programming, Fall 2026

A React app made with Vite that loads posts from JSONPlaceholder, shows loading, error and empty
states, and lets you filter the posts by title.

## Running

```
npm install
npm run dev
```

node_modules is not in the repo (it is in .gitignore), so `npm install` is needed first.

## File organization

```
index.html                      page with the #root div
package.json                    dependencies and scripts (from Vite)
vite.config.js                  Vite config (from the template)
src/
  main.jsx                      mounts <App /> into #root
  App.jsx                       owns the state, runs the fetch effect, filters during render
  api/
    postsApi.js                 fetchPosts() - only fetch + JSON, no React
  reducer/
    postsReducer.js             initialState and the reducer for the three fetch actions
  components/
    FilterForm.jsx              controlled input for the title filter
    PostList.jsx                maps posts to Post components, key = post.id
    Post.jsx                    shows one post's title and body
```

Data flows one way. App has the reducer state (`posts`, `loading`, `error`) and the `filter` string.
It passes the filter value and setter to FilterForm, and the filtered posts to PostList. PostList and
Post only render what they get as props.

## Challenges I faced

**Where the async code goes.** My first thought was to call fetch inside the reducer when
FETCH_START comes in, but a reducer has to be pure and cannot wait for anything. So the reducer
only describes how state changes for each action, and the effect in App does the actual fetch and
dispatches FETCH_START, then FETCH_SUCCESS or FETCH_ERROR.

**Cleanup in useEffect.** If the component unmounts before the response comes back, dispatching
afterwards updates a component that is not there anymore. I used a local `ignore` flag that the
cleanup function sets to true, and only dispatch while it is still false. In development StrictMode
runs the effect twice, and this is also what stops the first request from overwriting the second.

**fetch does not throw on HTTP errors.** fetch only rejects when the network fails. A 404 or 500
still resolves, so without a check the app would try to show an error page as data. postsApi.js
checks `response.ok` and throws its own error with the status code, so both cases end up in the
same catch block and show a message instead of crashing.

**Not storing the filtered list.** It felt natural to keep a `filteredPosts` state and update it
when the filter changes, but then there are two copies of the same data that can go out of sync.
The filtered list is calculated from `posts` and `filter` on every render instead, and only the
original posts are stored.

**Three states, not two.** "Not loading and no error" does not mean there is something to show.
If the API returns an empty array, or the filter matches nothing, the page needs "No posts found."
instead of an empty space, so the empty state is checked separately from the list.
