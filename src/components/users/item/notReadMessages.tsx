import React, { FC } from 'react';
import { Message } from '../../../utils/types';

import './styles.scss';

type Props = {
  notReadMessages?: Message[];
  id: number;
};

const NotReadMessages: FC<Props> = ({ id, notReadMessages }) => {
  const amount = notReadMessages?.filter((m) => m.user.id === id).length;
  return (
    <>
      {amount! > 0 && (
        <div className='not-read-messages'>
          <span>
            <span>New</span>
            {amount}
          </span>
        </div>
      )}
    </>
  );
};

export default NotReadMessages;
