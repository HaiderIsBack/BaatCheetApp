import "./PageNotFound.css"

const PageNotFound = () => {
  return (
      <>
        <div className="pnf-container">
          <img src="/icons/angry-emoji.svg" />
          <h1>Bad Request : 404</h1>
          <p>"{location.pathname}" not found</p>
        </div>
      </>
    )
}

export default PageNotFound