import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/redux/store';
import '@/index.css';
import Cruises from '@/components/Cruises';
import { CruiseProvider } from './context/CruiseContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CruiseProvider>
          <Cruises />
        </CruiseProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
