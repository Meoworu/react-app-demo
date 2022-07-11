import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import { Main } from '@/pages/Main';
import { Layout } from '@/components/Layout';
import '@/assets/less/global.less';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="*" element={<Main />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
