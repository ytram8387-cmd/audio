const firebaseConfig = {
    apiKey: "AIzaSyA19RaRsx7oMuplO7u_DLGCMd0LrM9_lH4",
    authDomain: "galeria-audio.firebaseapp.com",
    projectId: "galeria-audio",
    storageBucket: "galeria-audio.appspot.com", 
    messagingSenderId: "767383891499",
    appId: "1:767383891499:web:76330735ecfa6ec95a846e"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.firestore();
