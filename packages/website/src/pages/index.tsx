import React from 'react';
import AppPreview from '~components/AppPreview';
import Features from '~components/features';
import Hero from '~components/Hero';

export default function index() {
	return (
		<div className="flex flex-col space-y-16 sm:space-y-24 md:space-y-36 justify-center items-center h-full w-full">
			<div className="flex flex-col space-y-16 sm:space-y-24 items-center h-full w-full min-h-[80vh] sm:min-h-screen">
				<Hero />
				<div className="flex justify-center">
					<AppPreview />
				</div>
			</div>
			<Features />
		</div>
	);
}
