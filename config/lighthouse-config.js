
var throttlingMethod = process.env.THROTTLINGMETHOD || 'simulate';
var executionEnvironment = process.env.DEVICE || 'mobile';

module.exports = {
    throttlingMethod, executionEnvironment
}