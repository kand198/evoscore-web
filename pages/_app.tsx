import EvoPage from '../components/EvoPage';
import CompetitionProvider from '../lib/CompetitionProvider';
import SerialProvider from '../lib/SerialProvider';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <CompetitionProvider>
      <SerialProvider>
        <EvoPage>
          <Component {...pageProps} />
        </EvoPage>
      </SerialProvider>
    </CompetitionProvider>
  );
};

export default MyApp;
