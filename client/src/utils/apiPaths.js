export const BASE_URL = "http://localhost:3000";

//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        GET_PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/profile'
    },
    EMPLOYER: {
        GET_STATS: '/api/employer/stats',
        CREATE_JOB: '/api/employer/jobs'
    },
    RESUME: {
        GET_ALL: '/api/resume',
        CREATE: '/api/resume',
        UPDATE: '/api/resume/:id',
        DELETE: '/api/resume/:id'
    },

    IMAGE: {
        UPLOAD_IMAGE: "api/auth/upload-image",
    }
}