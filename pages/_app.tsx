import EvoPage from '../components/EvoPage';
import CompetitionProvider from '../lib/CompetitionProvider';
import { EcuProvider } from '../lib/EcuContext';
import { NotificationProvider } from '../lib/NotificationContext';
import SerialProvider from '../lib/SerialProvider';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <CompetitionProvider>
      <NotificationProvider>
        <SerialProvider>
          <EcuProvider>
            <EvoPage>
              <Component {...pageProps} />
            </EvoPage>
          </EcuProvider>
        </SerialProvider>
      </NotificationProvider>
    </CompetitionProvider>
  );
};

export default MyApp;
