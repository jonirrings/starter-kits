import dva from 'dva';
import createLoading from 'dva-loading';
import { normalErrHandler } from './utils';

// fixme: 生产上要干掉下面这行
// import './mock';

const config = {
  onError: normalErrHandler,
};

// message
message.config({
  top: 76,
  duration: 3,
});

// initialization
const app = dva(config);

// plugin
app.use(createLoading());

// models

app.model(require('./models/global').default);

// routes
app.router(require('./router').default);

// start
app.start('#root');

app._store.dispatch({ type: 'global/initialization' });
