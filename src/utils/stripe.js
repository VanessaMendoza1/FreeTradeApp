import axios from 'axios';

const CreatePaymentIntent = data => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://freetradeserver-production.up.railway.app/payment-sheet',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(function (res) {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default CreatePaymentIntent;
