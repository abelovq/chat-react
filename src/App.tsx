import React from 'react';
import './App.css';
import { useEffect } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';

import LoginForm from './components/forms/login';
import Conversations from './pages/conversations';
import { AppContainer } from './styled.components';
import { checkAuth } from './store/slices/auth.slice';
import { useAppDispatch, useTypedSelector } from './store/types';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthWrapper />}>
          <Route path='conversations' element={<Conversations />}>
            <Route path=':id' element={<Conversations />} />
          </Route>
        </Route>
        <Route element={<HomeLayout />}>
          <Route path='login' element={<LoginForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const AuthWrapper = () => {
  const { isAuth } = useTypedSelector((state) => state.auth);
  const location = useLocation();
  if (isAuth) {
    return (
      <AppContainer>
        <Outlet />
      </AppContainer>
    );
  }
  return <Navigate to='/login' replace state={{ from: location }} />;
};

export const HomeLayout = () => {
  const { isAuth } = useTypedSelector((state) => state.auth);
  const location = useLocation();

  const navigateTo = () => {
    if (
      location.state?.from?.pathname === '/' ||
      location.state?.from?.pathname === '/login' ||
      location.state?.from?.pathname === '/conversations' ||
      !location.state?.from?.pathname
    ) {
      return '/conversations';
    }
    return location.state?.from?.pathname;
  };

  if (isAuth) {
    return <Navigate to={navigateTo()} />;
  }

  return <Outlet />;
};

export default App;
