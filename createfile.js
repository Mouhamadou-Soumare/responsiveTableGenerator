import { open } from 'node:fs/promises';
import {writeFile} from 'node:fs/promises';


try {
    await writeFile('message.txt', "Bonjour les gens");
    (async () => {
      const file = await open('message.txt');
    
      for await (const line of file.readLines()) {
        console.log(line);
      }
    })();

  } catch (err) {
    // When a request is aborted - err is an AbortError
    console.error(err);
  } 

