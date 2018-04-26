Object.entries(Unstable.globals.levels).forEach(([key, val]) => {
	Unstable.globals.levels[key].completion = -1;
});

Unstable.saveProgress();
