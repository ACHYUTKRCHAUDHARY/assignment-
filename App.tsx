
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AppRouter from './routing/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <DataProvider>
            <AppRouter />
          </DataProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
