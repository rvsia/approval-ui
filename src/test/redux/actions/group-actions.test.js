import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import {
  FETCH_RBAC_GROUPS
} from '../../../redux/action-types';
import { fetchRbacGroups } from '../../../redux/actions/group-actions';
import { RBAC_API_BASE } from '../../../utilities/constants';

describe('group redux action creators', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('fetchRbacGroups should dispatch correct ations on success', () => {
    const store = mockStore({});
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({
      body: { data: [{ uuid: 'foo', name: 'bar' }]}}));

    const expectedActions = [{
      type: `${FETCH_RBAC_GROUPS}_PENDING`
    }, {
      type: `${FETCH_RBAC_GROUPS}_FULFILLED`,
      payload: [{ label: 'bar', value: 'foo' }]
    }];

    return store.dispatch(fetchRbacGroups()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('fetchRbacGroups should dispatch correct ations when failed', () => {
    const store = mockStore({});
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ status: 500 }));

    const expectedActions = [{
      type: `${FETCH_RBAC_GROUPS}_PENDING`
    }, {
      type: ADD_NOTIFICATION,
      payload: {
        dismissable: true,
        title: 'Error',
        variant: 'danger'
      }
    }, expect.objectContaining({ type: `${FETCH_RBAC_GROUPS}_REJECTED` }) ];

    return store.dispatch(fetchRbacGroups()).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
