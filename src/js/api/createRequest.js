const createRequest = (url, method, data = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    const isGetMethod = method === 'deleteById' || method === 'allTickets' || method === 'ticketById';

    try {
      switch (method) {
        case 'createTicket':
          xhr.open('POST', `${url}?method=${method}`);
          break;

        case 'updateById':
          xhr.open('POST', `${url}?method=${method}&id=${data.id}`);
          break;

        case 'allTickets':
          xhr.open('GET', `${url}?method=${method}`);
          break;

        case 'ticketById':
        case 'deleteById':
          xhr.open('GET', `${url}?method=${method}&id=${data.id}`);
          break;

        default:
          throw new Error(`Unsupported method`);
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(xhr.response);
          } catch (e) {
            reject(new Error(`${xhr.status}`));
          }
        }
      })

      if (isGetMethod) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    } catch (error) {
      throw new Error(error);
    }
  })
}

export default createRequest;
