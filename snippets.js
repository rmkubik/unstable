const scores = require('./ryan_scores_1.json');
Object.entries(scores.levels).map(([key, val]) => val.times.map(r => [key,r.time])).reduce((acc, val) => acc.concat(val), []);
