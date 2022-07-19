import React from "react";

interface CodeSnippetProps
{
   code: string;
   title?: string;
}

// eslint-disable-next-line react/function-component-definition
function CodeSnippet({title, code}: CodeSnippetProps): JSX.Element
{
   return (
      <div className="code-snippet">
         <span className="code-snippet__title">{title}</span>
         <div className="code-snippet__container">
            <div className="code-snippet__wrapper">
               <pre className="code-snippet__body">{code}</pre>
            </div>
         </div>
      </div>
   );
}

CodeSnippet.defaultProps = {
   title: undefined,
};

export default CodeSnippet;
