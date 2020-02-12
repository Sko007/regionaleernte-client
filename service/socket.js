import io from 'socket.io-client';
import { find, remove } from 'lodash'
import { WS_URL } from '@/config'
let socket = io(WS_URL)
export class SocketService {
  constructor() {
    // this.arr = []
  }
  syncUpdates(modelName, array) {
    socket.on(modelName + ':save', async function (item) {
      var oldItem = await find(array, { _id: item._id });
      var index = array.indexOf(oldItem);
      var event = 'created';
      // replace oldItem if it exists otherwise just add item to the collection
      if (oldItem) {
        array.splice(index, 1, item);
        event = 'updated';
      } else {
        array.push(item);
      }
      // console.log('saved..........', item);
      // this.arr = array

      // noop(event, item, array);
    });

    socket.on(modelName + ':remove', function (item) {
      // console.log('remove..................', );
      var event = 'deleted';
      remove(array, { _id: item._id });
      // cb(event, item, array);
    });
  }

  unsyncUpdates(modelName) {
    socket.removeAllListeners(modelName + ':save');
    socket.removeAllListeners(modelName + ':remove');
  }
}
