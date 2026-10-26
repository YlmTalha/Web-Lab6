function Post({ title, body }) {
  return (
    <article style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px 16px', margin: '12px 0' }}>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  )
}

export default Post
