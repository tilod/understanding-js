const { Worker, isMainThread, workerData } = require('worker_threads');


if (isMainThread) {
	for(let i = 0; i < 8; ++i) {
		const w = new Worker(__filename, { workerData: i });
	}

	setInterval((a) => console.log(a), 1000, 'Still alive!');
} else {
   console.log('Started: ', workerData);

	while (true) {
		Math.random();
	}
}
