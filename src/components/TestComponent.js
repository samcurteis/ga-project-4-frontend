import { useEffect, useState } from 'react';
import { useAuthenticated } from '../../hooks/useAuthenticated';
import axios from 'axios'


export default function TestComponent() {
  const [isLoggedIn] = useAuthenticated();
    const [ currentAuthor, setCurrentAuthor ] = useState(null)

    async function getCurrentAuthor() {
        try {
            const response = await axios.get('test-endpoint');
            console.log(response)
            const data = await response.data
            console.log(data)
            setCurrentAuthor(data)
        } catch(error) {
            console.log(error)
        }
    }


  useEffect(() => {
      getCurrentAuthor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <div>
      {isLoggedIn && ( 
      <p>{currentAuthor?.name}</p>
      )}
      </div>
  );
}

