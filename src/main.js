import initApp from './init'
document.addEventListener('DOMContentLoaded', initApp);

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}
