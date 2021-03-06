import axios from 'axios';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { GroupApi } from '@redhat-cloud-services/rbac-client';
import { WorkflowApi, ActionApi, RequestApi, TemplateApi } from '@redhat-cloud-services/approval-client';

const axiosInstance = axios.create();

const resolveInterceptor = response => response.data || response;
const errorInterceptor = (error = {}) => {
  throw { ...error.response };
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async config => {
  await window.insights.chrome.auth.getUser();
  return config;
});
axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.response.use(null, errorInterceptor);

// Approval Apis

const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
const actionApi = new ActionApi(undefined, APPROVAL_API_BASE, axiosInstance);
const requestApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const templateApi = new TemplateApi(undefined, APPROVAL_API_BASE, axiosInstance);

const rbacGroupApi = new GroupApi(undefined, RBAC_API_BASE, axiosInstance);

// Approval APIs
export function getRequestApi() {
  return requestApi;
}

export function getTemplateApi() {
  return templateApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getActionApi() {
  return actionApi;
}

export function getRbacGroupApi() {
  return rbacGroupApi;
}

export function getAxiosInstance() {
  return axiosInstance;
}
