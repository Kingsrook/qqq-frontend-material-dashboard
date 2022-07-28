import React from "react";

function Loader() : JSX.Element
{
   const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

   return (
      <div className="loader">
         <img style={{height: "25px"}} src={loadingImg} alt="Loading..." />
      </div>
   );
}

export default Loader;
