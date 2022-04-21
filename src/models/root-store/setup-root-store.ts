import { onSnapshot } from 'mobx-state-tree';
import { RootStore, RootStoreModel } from './root-store';
// import { Environment } from '../environment';

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root';

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
// export async function createEnvironment() {
//   const env = new Environment();
//   await env.setup();
//   return env;
// }

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore;
  let data: any;

  // prepare the environment that will be associated with the RootStore.
  // const env = await createEnvironment();
  try {
    const dataString = localStorage.getItem(ROOT_STATE_STORAGE_KEY);

    data = dataString ? JSON.parse(dataString) : {};

    rootStore = RootStoreModel.create(data);
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({});

    // but please inform us what happened
    console.error(e);
  }

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) => {
    localStorage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot));
  });

  return rootStore;
}
