import StumpInterface from '@stump/interface';
import { StumpQueryProvider } from '@stump/client';

import '@stump/interface/styles';

export const baseUrl = import.meta.env.PROD ? window.location.href : 'http://localhost:10801';

export default function App() {
	return (
		<StumpQueryProvider>
			<StumpInterface platform={'browser'} baseUrl={baseUrl} />
		</StumpQueryProvider>
	);
}
