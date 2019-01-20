import { getTripData } from './volkswagen';
import { appendData } from './sheets';

getTripData()
  .then(appendData)
  .then(() => {
    console.log('success!');
  });
