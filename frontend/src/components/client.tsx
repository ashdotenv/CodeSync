import { IClient } from '@/types';
import Avatar from 'react-avatar';



const Client = ({ name } : IClient) => {
    return (
        <div className="flex flex-col gap-1 items-center">
            <Avatar name={name} size={'50'} round="14px" />
            <span className="text-sm">{name}</span>
        </div>
    );
};

export default Client;