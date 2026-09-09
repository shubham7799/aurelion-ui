import './BookCall.css';


export default function BookCall() {
  return (
    <section
      className="book-call"
      data-guide-media
      style={{ backgroundImage: 'url(../book-call.png)' }}
    >
      <div className="book-call-content">
        <h2>What would life feel like if 
            <br />
            you had more time for it?</h2>
        <p>Aurelion brings understanding, access and personal attention into the way you live — so the things that occupy your time don't have to occupy your mind.</p>
        <button type="button" className="book-call-link" onClick={()=>{}}>
          BOOK A PRIVATE CONVERSATION
        </button>
      </div>
    </section>
  );
}
