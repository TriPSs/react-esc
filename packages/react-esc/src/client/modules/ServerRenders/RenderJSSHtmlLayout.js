import React from 'react'
import server from 'react-dom/server'

export function renderJSSHtmlLayout(head, body, css, initialState = {}) {
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
        'style',
        {
          id                     : 'jss-server-side',
          dangerouslySetInnerHTML: { __html: css },
        },
      ),
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
