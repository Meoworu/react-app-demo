import ReactDOM from 'react-dom/client';
import '@/assets/less/global.less';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
