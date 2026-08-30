"use client";

export default function GlobalError({reset}:{error:Error & {digest?:string};reset:()=>void}) {
  return (
    <html lang="en">
      <body>
        <main style={{display:"grid",minHeight:"100vh",placeItems:"center",padding:"2rem",fontFamily:"Arial, sans-serif",background:"#f4fafb",color:"#102a32"}}>
          <section role="alert" style={{maxWidth:"34rem",padding:"2rem",border:"1px solid #d6e5e8",borderRadius:"1rem",background:"white",textAlign:"center"}}>
            <p style={{fontWeight:700,color:"#b42318"}}>AquaLoop could not start</p>
            <h1 style={{margin:"0.5rem 0",fontSize:"2rem"}}>Something went wrong</h1>
            <p>Retry the application. Your demo records remain in this browser session.</p>
            <button type="button" onClick={reset} style={{marginTop:"1.5rem",minHeight:"44px",padding:"0.65rem 1rem",border:0,borderRadius:"0.65rem",background:"#087e9e",color:"white",fontWeight:700}}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
