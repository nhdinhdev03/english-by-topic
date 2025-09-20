import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import About from '../Pages/About';
import Home from '../Pages/Home';
import Topic from '../Pages/Topic';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/topic/:topicName',
        element: <Topic />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
]);
