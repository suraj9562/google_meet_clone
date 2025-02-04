module.exports = {
  projects: {
    ios: {},
    android: {},
  },

  assets: ['./src/assets/fonts/'],
  getTransformModulePath() {
    return require.resolve('react-native-transcript-transformer');
  },
  getSourceExt() {
    return ['ts', 'tsx'];
  },
};
