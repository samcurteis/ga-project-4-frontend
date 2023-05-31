import { useEffect, useState } from 'react';
import axios from 'axios'


export default function TestComponent() {
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
      <p>{currentAuthor?.name}</p>
  );
}

