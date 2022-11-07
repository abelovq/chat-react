import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../store/services/auth';
import { setCredentials } from '../../../store/slices/auth.slice';
import { useAppDispatch, useTypedSelector } from '../../../store/types';
import {
  Button,
  Input,
  InputContainer,
  InputLabel,
} from '../../../styled.components';

import './styles.scss';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const [
    login, // This is the mutation trigger
    { isLoading }, // This is the destructured mutation result
  ] = useLoginMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(state).unwrap();
    console.log('user', user);
    dispatch(setCredentials(user));

    navigate('/conversations');
  };

  return (
    <form className='login-form' onSubmit={submit}>
      <InputContainer>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input
          onChange={handleChange}
          value={state.email}
          id='email'
          type='text'
        />
      </InputContainer>

      <InputContainer>
        <InputLabel htmlFor='password'>Password</InputLabel>
        <Input
          onChange={handleChange}
          value={state.password}
          type='password'
          id='password'
        />
      </InputContainer>
      <Button type='submit'>Login</Button>
    </form>
  );
};

export default LoginForm;
