import EvoPage from '../components/EvoPage';
import SerialProvider from '../lib/SerialProvider';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <SerialProvider>
      <EvoPage>
        <Component {...pageProps} />
      </EvoPage>
    </SerialProvider>
  );
};

export default MyApp;
