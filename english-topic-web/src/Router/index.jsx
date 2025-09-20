import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import About from '../Pages/About';
import Home from '../Pages/Home';
import ListTopic from '../Pages/List-Topic';
import Practice from '../Pages/Practice';
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
        path: '/topics',
        element: <ListTopic />,
      },
      {
        path: '/topic/:topicName',
        element: <Topic />,
      },
      {
        path: '/practice/:topicName',
        element: <Practice />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
]);
