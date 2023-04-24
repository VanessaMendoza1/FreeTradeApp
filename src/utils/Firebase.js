import auth from '@react-native-firebase/auth';

const sas = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(async userCredential => {
      const user = userCredential.user;
      if (user.emailVerified) {
        let userData = [];
        await firestore()
          .collection('Users')
          .doc(user.uid)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              userData.push(documentSnapshot.data());
            }
          })
          .catch(err => console.warn(err));

        return userData[0];
      } else {
        alert('Email is not verified Please check your Inbox');
      }
    })
    .catch(error => {
      //   setloading(true);
      const errorMessage = error.code;
      console.log(errorMessage);
      if (errorMessage === 'auth/wrong-password') {
        alert('Wrong Password');
      }
      if (errorMessage === 'auth/user-not-found') {
        alert('This Email is Not Register');
      }
    });
};

const OnLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        if (user.emailVerified) {
          let userData = [];
          await firestore()
            .collection('Users')
            .doc(user.uid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
                userData.push(documentSnapshot.data());
              }
            })
            .catch(err => console.warn(err));

          resolve(userData[0]);
        } else {
          alert('Email is not verified Please check your Inbox');
        }
      })
      .catch(error => {
        // setloading(true);
        const errorMessage = error.code;
        reject(error.code);
        console.log(errorMessage);
        // if (errorMessage === 'auth/wrong-password') {
        //   alert('Wrong Password');
        // }
        // if (errorMessage === 'auth/user-not-found') {
        //   alert('This Email is Not Register');
        // }
      });
  });
};

export default {OnLogin};
