import adapter from '@sveltejs/adapter-node';
import json from '@rollup/plugin-json';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		  
	}
};
plugins: [
	json({
	  compact: true
	}),
	// other plugins...
  ]
export default config;
