import React from 'react'
import server from 'react-dom/server'

export default (head, body, initialState = {}) => {
  return '<!DOCTYPE html>' + (0, server.renderToStaticMarkup)(React.createElement(
    'html',
    head.htmlAttributes.toComponent(),
    React.createElement(
      'head',
      null,
      head.title.toComponent(),
      head.meta.toComponent(),
      head.base.toComponent(),
      head.link.toComponent(),
      head.script.toComponent(),
      head.style.toComponent(),
      React.createElement(
        'script',
        {
          dangerouslySetInnerHTML: { __html: `___INITIAL_STATE__=${JSON.stringify(initialState)}` },
        },
      ),
    ),
    React.createElement(
      'body',
      null,
      body,
    ),
  ))
}
