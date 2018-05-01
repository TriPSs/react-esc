import client from 'react-esc/client'
import jssRender from 'react-esc-jss/client'

import AppContainer from './containers/AppContainer'

client.setRenderMethod(jssRender)
client.render(AppContainer)
