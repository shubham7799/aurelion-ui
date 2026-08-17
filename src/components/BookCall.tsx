import './BookCall.css';


export default function BookCall({}) {
  return (
    <section className="book-call" style={{ backgroundImage: 'url(../book-call.png)' }}>
      <div className="book-call-content">
        <h2>Same view,
            <br />
            different vibe.</h2>
        <p>The Cambrian. Perfect for spa days,<br/> families, and alpine adventures.</p>
        <button type="button" className="book-call-link" onClick={()=>{}}>
          Book a call
        </button>
      </div>
    </section>
  );
}
