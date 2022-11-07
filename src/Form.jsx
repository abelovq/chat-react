import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';

export const Form = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <label className='form-login'>
      Name
      <input
        value={name}
        type='text'
        onChange={(e) => setName(e.target.value)}
      />{' '}
      <input
        value={password}
        type='password'
        onChange={(e) => setPassword(e.target.value)}
      />{' '}
      <button
        onClick={() => {
          dispatch({ type: 'login', payload: { name, password } });
        }}
      >
        LOGIN
      </button>
    </label>
  );
};
