//export const BASE_URL = "http://localhost:3000";
 export const BASE_URL = "https://potentia-api-production.up.railway.app/";
//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        GET_PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/profile',
        // VERIFY: `/api/auth/verify/${token}`
        VERIFY: `/api/auth/verify/`,
        CHANGE_PASSWORD: '/api/auth/change-password',
    },
    EMPLOYER: {
        GET_STATS: '/api/employer/stats',
        CREATE_JOB: '/api/employer/jobs',
        GET_JOBS: '/api/employer/jobs',
        DELETE_JOB: (id) => `/api/employer/jobs/${id}`,
        UPDATE_JOB: (id) => `/api/employer/jobs/${id}`
    },
    JOBS: {
        GET_ALL: '/api/jobs',
        GET_ONE: '/api/jobs',
        GET_EMPLOYER_JOBS: '/api/employer/jobs'
    },
     REMOTE_JOBS: {
        GET_BY_ID: "/api/remote-jobs/byRemoteId",
        CREATE_OR_GET: "/api/remote-jobs/createOrGet"
    },
    RESUME: {
        GET_ALL: '/api/resume',
        GET_USER_RESUMES: '/api/resume',
        CREATE: '/api/resume',
        GET_BY_ID:(id)=>`/api/resume/${id}`,
        UPDATE:(id)=>`/api/resume/${id}`,
        DELETE: (id)=>`/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
        uploadAndAnalyzeCV: '/api/ai/extract-text',
        mejorar:'api/cv/mejorar',
    },

    IMAGE: {
        UPLOAD_IMAGE: "api/auth/upload-image",
    },
    APPLICATIONS: {
        CREATE: '/api/applications',
        GET_BY_JOB: (jobId) => `/api/applications/job/${jobId}`,
        UPDATE_STATUS: (applicationId) => `/api/applications/${applicationId}/status`,
        GET_MY_APPLICATIONS: '/api/applications/my-applications',
        GET_BY_ID: (applicationId) => `/api/applications/${applicationId}`
    }
}