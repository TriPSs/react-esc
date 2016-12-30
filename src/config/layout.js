// Default Helmet props
export default {
  htmlAttributes: {lang: 'en'},
  title         : 'Title',
  defaultTitle  : 'Default Title',
  titleTemplate : '%s - React ESC',
  meta          : [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link          : [
    {rel: 'shortcut icon', href: '/favicon.ico'},
  ],
  script        : [],
  style         : []
}
